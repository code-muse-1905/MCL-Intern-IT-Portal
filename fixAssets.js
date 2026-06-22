const { Asset, User } = require('./models/index');
const sequelize = require('./config/db');

sequelize.authenticate().then(async () => {

  const users = await User.findAll();

  // Helper to find user by name
  const findUser = (name) => users.find(u => u.name === name);

  // Assign specific assets to specific users
  const assignments = [
    { serialNumber: 'SN001', userName: 'Rahul Sharma' },      // IT
    { serialNumber: 'SN002', userName: 'Priya Patel' },       // HR
    { serialNumber: 'SN003', userName: 'Neha Gupta' },        // IT
    { serialNumber: 'SN004', userName: 'Sneha Verma' },       // Engineering
    { serialNumber: 'SN006', userName: 'Amit Kumar' },        // Finance
    { serialNumber: 'SN007', userName: 'Deepak Rao' },        // IT
    { serialNumber: 'SN008', userName: 'Anita Kulkarni' },    // IT
    { serialNumber: 'SN011', userName: 'Vikram Singh' },      // Management
    { serialNumber: 'SN012', userName: 'Kiran Joshi' },       // Engineering
    { serialNumber: 'SN013', userName: 'Rajesh Nair' },       // ERP
    { serialNumber: 'SN014', userName: 'Anjali Das' },        // Finance
    { serialNumber: 'SN016', userName: 'Manoj Pandey' },      // Engineering
    { serialNumber: 'SN018', userName: 'Suresh Reddy' },      // HR
    { serialNumber: 'SN019', userName: 'Meena Iyer' },        // Management
  ];

  for (const a of assignments) {
    const user = findUser(a.userName);
    if (user) {
      await Asset.update(
        { assignedTo: user.id, status: 'assigned' },
        { where: { serialNumber: a.serialNumber } }
      );
      console.log(`✅ ${a.serialNumber} → ${user.name}`);
    } else {
      console.log(`❌ User not found: ${a.userName}`);
    }
  }

  console.log('🎉 Done!');
  process.exit();
});