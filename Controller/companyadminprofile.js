const Admin = require('../Model/adminModel');

// GET /api/admin/profile/:email
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.params.email });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    // console.log('Looking for email:', req.params.email);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// PUT /api/admin/profile/:email
const updateAdminProfile = async (req, res) => {
  try {
    const updated = await Admin.findOneAndUpdate(
      { email: req.params.email },
      { ...req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Admin not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

module.exports = { getAdminProfile, updateAdminProfile };