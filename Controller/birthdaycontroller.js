const Employee = require("../Model/employee");

exports.getUpcomingBirthdays = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth(); 
    const currentDay = today.getDate();
    const nextMonth = (currentMonth + 1) % 12;

    const employees = await Employee.find();

    const upcomingEmployees = employees
      .filter(emp => {
        if (!emp.dateOfBirth) return false;

        const bday = new Date(emp.dateOfBirth);
        const birthMonth = bday.getMonth();
        const birthDay = bday.getDate();

        // ✔ Only show future birthdays (not past in current month)
        return (
          (birthMonth === currentMonth && birthDay >= currentDay) ||
          (birthMonth === nextMonth)
        );
      })
      .map(emp => ({
        _id: emp._id,
        name: `${emp.firstName} ${emp.lastName}`,
        birthday: emp.dateOfBirth,
        profilePicture: emp.profilePic || null,
      }));

    console.log("🎂 Upcoming Birthdays (Today + Future Only):", upcomingEmployees);

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
