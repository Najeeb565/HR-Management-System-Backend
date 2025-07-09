// controllers/birthdayController.js
const Employee = require("../Model/employee");
const Admin = require("../Model/adminModel");

exports.getUpcomingBirthdays = async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const nextMonthNum = nextMonth.getMonth() + 1;
    const nextDay = nextMonth.getDate();

    const getMonthDay = (date) => ({
      month: date.getMonth() + 1,
      day: date.getDate(),
    });

    const checkBirthdayInRange = (date) => {
      const bday = new Date(date);
      const month = bday.getMonth() + 1;
      const day = bday.getDate();

      if (currentMonth === nextMonthNum) {
        return month === currentMonth && day >= currentDay && day <= nextDay;
      } else {
        return (
          (month === currentMonth && day >= currentDay) ||
          (month === nextMonthNum && day <= nextDay) ||
          (month > currentMonth && month < nextMonthNum)
        );
      }
    };

    const employees = await Employee.find();
    const admins = await Admin.find();

    const upcomingEmployees = employees.filter((emp) => checkBirthdayInRange(emp.birthday));
    const upcomingAdmins = admins.filter((admin) => checkBirthdayInRange(admin.birthday));

    res.status(200).json({
      success: true,
      employees: upcomingEmployees,
      admins: upcomingAdmins,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err });
  }
};
