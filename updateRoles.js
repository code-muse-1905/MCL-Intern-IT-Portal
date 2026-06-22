const { User } = require('./models/index');
const sequelize = require('./config/db');

sequelize.authenticate().then(async () => {
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
    console.log(`✅ ${email} → admin`);
  }

  await User.update(
    { role: 'employee' },
    { where: { role: ['it_staff', 'manager'] } }
  );
  console.log('✅ All it_staff and manager → employee');

  console.log('🎉 Done!');
  process.exit();
});