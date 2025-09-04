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




const updateAdminProfile = async (req, res) => {
  try {
    const email = req.params.email;

    const updateData = { ...req.body };

    // ✅ Handle image file
    if (req.file) {
      updateData.profilePic = req.file.filename; // Save only filename
    }

    const updated = await Admin.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );
    if (updateData.birthday === "null" || updateData.birthday === "") {
  updateData.birthday = null;
} else if (updateData.birthday) {
  updateData.birthday = new Date(updateData.birthday);
}


    if (!updated) return res.status(404).json({ message: "Admin not found" });
    res.json(updated);

  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = { getAdminProfile, updateAdminProfile };