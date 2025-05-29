// server/controller/companycontroller.js
const asyncHandler = require('express-async-handler');
const Company = require('../Model/authschema');
const Admin = require('../Model/adminModel');

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
  res.status(201).json({ success: true, data: company });
});

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

const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error(`Company not found with id of ${req.params.id}`);
  }
  await Admin.deleteMany({ companyId: company._id });
  await company.remove();
  res.json({ success: true, data: {} });
});

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

const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Aggregate company stats
    const totalCompanies = await Company.countDocuments();
    const companiesByStatus = await Company.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]).then(results => {
      const statusMap = { pending: 0, approved: 0, rejected: 0, blocked: 0 };
      results.forEach(result => {
        statusMap[result._id] = result.count;
      });
      return statusMap;
    });

    // Aggregate admin stats
    const totalAdmins = await Admin.countDocuments();
    const adminsByRole = await Admin.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]).then(results => {
      const roleMap = { superAdmins: 0, companyAdmins: 0 };
      results.forEach(result => {
        roleMap[result._id === 'superAdmin' ? 'superAdmins' : 'companyAdmins'] = result.count;
      });
      return roleMap;
    });

    // Calculate new companies (e.g., last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newCompanies = await Company.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Monthly registrations (last 12 months)
    const monthlyRegistrations = await Company.aggregate([
      {
        $match: { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]).then(results => results.map(result => ({
      month: result._id,
      count: result.count
    })));

    // Total employees (assuming no Employee model is provided, set to 0)
    const totalEmployees = 0; // Update if you have an Employee model

    res.json({
      success: true,
      data: {
        totalCompanies,
        companiesByStatus,
        totalAdmins,
        adminsByRole,
        totalEmployees,
        newCompanies,
        monthlyRegistrations
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  changeCompanyStatus,
  deleteCompany,
  assignAdmin,
  getDashboardStats
};