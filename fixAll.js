const { User, Department } = require('./models/index');
const sequelize = require('./config/db');

sequelize.authenticate().then(async () => {

  const departments = await Department.findAll();

  // Step 1 — Fix departmentId for all users
  const users = await User.findAll();
  for (const user of users) {
    if (user.department) {
      const dept = departments.find(d => d.name === user.department);
      if (dept) {
        await user.update({ departmentId: dept.id });
        console.log(`✅ Fixed departmentId: ${user.name} → ${dept.name} (id:${dept.id})`);
      }
    }
  }

  // Step 2 — Set dept admins
  const admins = [
    'rahul.sharma@mcl.com',
    'priya.patel@mcl.com',
    'amit.kumar@mcl.com',
    'sneha.verma@mcl.com',
    'vikram.singh@mcl.com',
    'rajesh.nair@mcl.com',
    'pooja.mehta@mcl.com',
  ];

  for (const email of admins) {
    await User.update({ role: 'admin' }, { where: { email } });
    console.log(`⭐ Set admin: ${email}`);
  }

  // Step 3 — Set everyone else (not superadmin, not admin) to employee
  await User.update(
    { role: 'employee' },
    { where: { role: ['it_staff', 'manager'] } }
  );
  console.log('✅ All it_staff and manager → employee');

  console.log('\n🎉 All fixed! Your structure is now:');
  console.log('👑 superadmin@mcl.com → Super Admin');
  console.log('⭐ rahul.sharma@mcl.com → IT Admin');
  console.log('⭐ priya.patel@mcl.com → HR Admin');
  console.log('⭐ amit.kumar@mcl.com → Finance Admin');
  console.log('⭐ sneha.verma@mcl.com → Engineering Admin');
  console.log('⭐ vikram.singh@mcl.com → Management Admin');
  console.log('⭐ rajesh.nair@mcl.com → ERP Admin');
  console.log('⭐ pooja.mehta@mcl.com → P&P Admin');
  console.log('👤 Everyone else → Employee');

  process.exit();
});