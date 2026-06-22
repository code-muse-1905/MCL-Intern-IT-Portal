const { User, Department } = require('./models/index');
const sequelize = require('./config/db');

sequelize.authenticate().then(async () => {
  const users = await User.findAll();
  const departments = await Department.findAll();

  for (const user of users) {
    if (user.department && !user.departmentId) {
      const dept = departments.find(d => d.name === user.department);
      if (dept) {
        await user.update({ departmentId: dept.id });
        console.log(`✅ Fixed: ${user.name} → ${dept.name} (id: ${dept.id})`);
      }
    }
  }

  console.log('🎉 Done fixing departmentIds!');
  process.exit();
});