const Employee = require("../Model/employee");

exports.getUpcomingBirthdays = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth(); 
    const currentDay = today.getDate();

    const employees = await Employee.find();

    const upcomingEmployees = employees
      .filter(emp => {
        if (!emp.dateOfBirth) return false;

        const bday = new Date(emp.dateOfBirth);
        const birthMonth = bday.getMonth();
        const birthDay = bday.getDate();

        // ✅ Only include birthdays from current month & future days
        return birthMonth === currentMonth && birthDay >= currentDay;
      })
      .map(emp => ({
        _id: emp._id,
        name: `${emp.firstName} ${emp.lastName}`,
        birthday: emp.dateOfBirth,
        profilePicture: emp.profilePic || null,
      }));

    console.log("🎂 Upcoming Birthdays (Only This Month):", upcomingEmployees);

    res.status(200).json({
      success: true,
      employees: upcomingEmployees,
    });

  } catch (err) {
    console.error("🎂 Birthday Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
