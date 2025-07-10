const asyncHandler = require('express-async-handler');
const Company = require('../Model/authschema');
const Admin = require('../Model/adminModel');
const bcrypt = require('bcryptjs');
const { response } = require('express');

// Get all companies with pagination, filtering, and sorting
const getCompanies = asyncHandler(async (req, res) => {
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  query = Company.find(JSON.parse(queryStr)).populate('admins', 'name email role');
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Company.countDocuments(JSON.parse(queryStr));
  query = query.skip(startIndex).limit(limit);
  const companies = await query;
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }
  res.json({
    success: true,
    count: companies.length,
    pagination,
    data: companies
  });
});

// Get only company status by ID
const getCompanyStatus = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).select('status');
  // console.log("Params:", req.params);

  if (!company) {
    res.status(404);
    throw new Error(`Company not found with id of ${req.params.id}`);
  }
  res.json({ success: true, status: company.status });
});


// Get a single company by ID
const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id).populate('admins', 'name email role');
  if (!company) {
    res.status(404);
    throw new Error(`Company not found with id of ${req.params.id}`);
  }
  res.json({ success: true, data: company });
});

const createCompany = asyncHandler(async (req, res) => {
  const company = await Company.create({ ...req.body, status: 'pending' });
  console.log("✅ New company created:", company); // backend console
  res.status(201).json({
    success: true,
    message: "Company registered successfully",
    companyId: company._id.toString()
  });
});

// Update a company by ID
const updateCompany = asyncHandler(async (req, res) => {
  let company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error(`Company not found with id of ${req.params.id}`);
  }
  company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json({ success: true, data: company });
});

// Change company status
const changeCompanyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status || !['pending', 'approved', 'rejected', 'blocked'].includes(status)) {
    res.status(400);
    throw new Error('Please provide a valid status');
  }
  let company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error(`Company not found with id of ${req.params.id}`);
  }
  company = await Company.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: company });
});

// Delete a company and associated admins
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error(`Company not found with id of ${req.params.id}`);
  }
  await Admin.deleteMany({ companyId: company._id });
  await Company.deleteOne({ _id: company._id }); // Use deleteOne instead of remove
  res.json({ success: true, data: {} });
});

// Assign an admin to a company
const assignAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.body;
  if (!adminId) {
    res.status(400);
    throw new Error('Please provide admin id');
  }
  let company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error(`Company not found with id of ${req.params.id}`);
  }
  const admin = await Admin.findById(adminId);
  if (!admin) {
    res.status(404);
    throw new Error(`Admin not found with id of ${adminId}`);
  }
  await Admin.findByIdAndUpdate(adminId, { companyId: company._id });
  if (!company.admins.includes(adminId)) {
    company = await Company.findByIdAndUpdate(
      req.params.id,
      { $push: { admins: adminId } },
      { new: true, runValidators: true }
    );
  }
  res.json({ success: true, data: company });
});

// Get dashboard analytics data
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Company stats
    const totalCompanies = await Company.countDocuments();
    const companiesByStatus = await Company.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).then(results => {
      const statusMap = { pending: 0, approved: 0, rejected: 0, blocked: 0 };
      results.forEach(result => { statusMap[result._id] = result.count; });
      return statusMap;
    });

    // Admin stats (mapped to userStats)
    const totalAdmins = await Admin.countDocuments();
    const adminsByRole = await Admin.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]).then(results => {
      const roleMap = { superAdmins: 0, companyAdmins: 0 };
      results.forEach(result => {
        roleMap[result._id === 'superAdmin' ? 'superAdmins' : 'companyAdmins'] = result.count;
      });
      return roleMap;
    });

    // New registrations in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newCompanies = await Company.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newAdmins = await Admin.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Monthly registrations (last 12 months)
    const monthlyRegistrations = await Company.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]).then(results => results.map(result => ({ month: result._id, count: result.count })));

    const monthlyAdminRegistrations = await Admin.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]).then(results => results.map(result => ({ month: result._id, count: result.count })));

    // Generate monthly data for charts
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - 11 + i);
      return date.toISOString().slice(0, 7); // Format: YYYY-MM
    });
    const monthlyData = {
      labels: months,
      companies: months.map(month => {
        const found = monthlyRegistrations.find(item => item.month === month);
        return found ? found.count : 0;
      }),
      users: months.map(month => {
        const found = monthlyAdminRegistrations.find(item => item.month === month);
        return found ? found.count : 0;
      }),
      revenue: months.map(() => 0) // Placeholder, update if revenue model exists
    };

    // Placeholder revenue stats
    const revenueStats = {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    };

    res.json({
      success: true,
      data: {
        userStats: {
          total: totalAdmins,
          active: adminsByRole.companyAdmins,
          inactive: adminsByRole.superAdmins,
          newThisMonth: newAdmins
        },
        companyStats: {
          total: totalCompanies,
          active: companiesByStatus.approved,
          pending: companiesByStatus.pending,
          blocked: companiesByStatus.blocked
        },
        revenueStats,
        monthlyData
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//  Set a new admin for a company
const setCompanyAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { companyId } = req.params;

  console.log('Company ID:', companyId);

  //  Check if company exists
  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  //  Check if an admin with this email already exists for the same company
  const existingAdmin = await Admin.findOne({ email, companyId });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Admin with this email already exists for this company' });
  }

  try {
    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create new admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: 'companyAdmin',
      companyId,
    });

    //  Add admin to company's admin list
    company.admins.push(newAdmin._id);
    await company.save();

    res.status(201).json({ message: 'Company admin created successfully' });

  } catch (err) {
    //  Handle duplicate email error from MongoDB
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: 'This email is already in use.' });
    }
    console.error('Error in setCompanyAdmin:', err);
    res.status(500).json({ message: 'Something went wrong on the server.' });
  }
});




module.exports = {
  getCompanies,
  getCompany,
  getCompanyStatus,
  createCompany,
  updateCompany,
  changeCompanyStatus,
  deleteCompany,
  assignAdmin,
  getDashboardStats,
  setCompanyAdmin
};