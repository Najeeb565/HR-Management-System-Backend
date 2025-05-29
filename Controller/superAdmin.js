const Company = require("../Model/authschema"); // or your actual company model

// SuperAdmin controller to fetch all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
};

module.exports = { getAllCompanies };