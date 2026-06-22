require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const { User, Asset, Department } = require('../models/index');

const departments = [
  { name: 'IT', code: 'IT', description: 'Information Technology' },
  { name: 'Engineering', code: 'ENG', description: 'Engineering Department' },
  { name: 'HR', code: 'HR', description: 'Human Resources' },
  { name: 'Finance', code: 'FIN', description: 'Finance Department' },
  { name: 'Management', code: 'MGT', description: 'Management Department' },
  { name: 'P&P', code: 'PNP', description: 'Planning and Policy' },
  { name: 'ERP', code: 'ERP', description: 'ERP Department' },
];

const users = [
  // ─── SUPER ADMIN ──────────────────────────────
  { name: 'Super Admin', email: 'superadmin@mcl.com', password: 'admin123', role: 'superadmin', department: 'IT' },

  // ─── DEPT ADMINS (one per dept) ───────────────
  { name: 'Rahul Sharma', email: 'rahul.sharma@mcl.com', password: 'password123', role: 'admin', department: 'IT' },
  { name: 'Priya Patel', email: 'priya.patel@mcl.com', password: 'password123', role: 'admin', department: 'HR' },
  { name: 'Amit Kumar', email: 'amit.kumar@mcl.com', password: 'password123', role: 'admin', department: 'Finance' },
  { name: 'Sneha Verma', email: 'sneha.verma@mcl.com', password: 'password123', role: 'admin', department: 'Engineering' },
  { name: 'Vikram Singh', email: 'vikram.singh@mcl.com', password: 'password123', role: 'admin', department: 'Management' },
  { name: 'Rajesh Nair', email: 'rajesh.nair@mcl.com', password: 'password123', role: 'admin', department: 'ERP' },
  { name: 'Pooja Mehta', email: 'pooja.mehta@mcl.com', password: 'password123', role: 'admin', department: 'P&P' },

  // ─── IT EMPLOYEES ─────────────────────────────
  { name: 'Neha Gupta', email: 'neha.gupta@mcl.com', password: 'password123', role: 'employee', department: 'IT' },
  { name: 'Deepak Rao', email: 'deepak.rao@mcl.com', password: 'password123', role: 'employee', department: 'IT' },
  { name: 'Anita Kulkarni', email: 'anita.kulkarni@mcl.com', password: 'password123', role: 'employee', department: 'IT' },
  { name: 'Harish Dubey', email: 'harish.dubey@mcl.com', password: 'password123', role: 'employee', department: 'IT' },
  { name: 'Nitin Desai', email: 'nitin.desai@mcl.com', password: 'password123', role: 'employee', department: 'IT' },
  { name: 'Asha Malhotra', email: 'asha.malhotra@mcl.com', password: 'password123', role: 'employee', department: 'IT' },
  { name: 'Santosh Kumar', email: 'santosh.kumar@mcl.com', password: 'password123', role: 'employee', department: 'IT' },

  // ─── HR EMPLOYEES ─────────────────────────────
  { name: 'Suresh Reddy', email: 'suresh.reddy@mcl.com', password: 'password123', role: 'employee', department: 'HR' },
  { name: 'Sanjay Tiwari', email: 'sanjay.tiwari@mcl.com', password: 'password123', role: 'employee', department: 'HR' },
  { name: 'Prakash Yadav', email: 'prakash.yadav@mcl.com', password: 'password123', role: 'employee', department: 'HR' },
  { name: 'Rekha Srivastava', email: 'rekha.srivastava@mcl.com', password: 'password123', role: 'employee', department: 'HR' },
  { name: 'Ramesh Ghosh', email: 'ramesh.ghosh@mcl.com', password: 'password123', role: 'employee', department: 'HR' },
  { name: 'Hemant Jain', email: 'hemant.jain@mcl.com', password: 'password123', role: 'employee', department: 'HR' },
  { name: 'Shalini Bhat', email: 'shalini.bhat@mcl.com', password: 'password123', role: 'employee', department: 'HR' },

  // ─── FINANCE EMPLOYEES ────────────────────────
  { name: 'Anjali Das', email: 'anjali.das@mcl.com', password: 'password123', role: 'employee', department: 'Finance' },
  { name: 'Ritu Agarwal', email: 'ritu.agarwal@mcl.com', password: 'password123', role: 'employee', department: 'Finance' },
  { name: 'Lakshmi Menon', email: 'lakshmi.menon@mcl.com', password: 'password123', role: 'employee', department: 'Finance' },
  { name: 'Ashok Bhatt', email: 'ashok.bhatt@mcl.com', password: 'password123', role: 'employee', department: 'Finance' },
  { name: 'Shobha Nair', email: 'shobha.nair@mcl.com', password: 'password123', role: 'employee', department: 'Finance' },
  { name: 'Sudha Pillai', email: 'sudha.pillai@mcl.com', password: 'password123', role: 'employee', department: 'Finance' },

  // ─── ENGINEERING EMPLOYEES ────────────────────
  { name: 'Kiran Joshi', email: 'kiran.joshi@mcl.com', password: 'password123', role: 'employee', department: 'Engineering' },
  { name: 'Manoj Pandey', email: 'manoj.pandey@mcl.com', password: 'password123', role: 'employee', department: 'Engineering' },
  { name: 'Rohit Saxena', email: 'rohit.saxena@mcl.com', password: 'password123', role: 'employee', department: 'Engineering' },
  { name: 'Divya Krishnan', email: 'divya.krishnan@mcl.com', password: 'password123', role: 'employee', department: 'Engineering' },
  { name: 'Tarun Bajaj', email: 'tarun.bajaj@mcl.com', password: 'password123', role: 'employee', department: 'Engineering' },
  { name: 'Ajay Thakur', email: 'ajay.thakur@mcl.com', password: 'password123', role: 'employee', department: 'Engineering' },
  { name: 'Aditya Verma', email: 'aditya.verma@mcl.com', password: 'password123', role: 'employee', department: 'Engineering' },

  // ─── MANAGEMENT EMPLOYEES ─────────────────────
  { name: 'Meena Iyer', email: 'meena.iyer@mcl.com', password: 'password123', role: 'employee', department: 'Management' },
  { name: 'Geeta Nambiar', email: 'geeta.nambiar@mcl.com', password: 'password123', role: 'employee', department: 'Management' },
  { name: 'Usha Chatterjee', email: 'usha.chatterjee@mcl.com', password: 'password123', role: 'employee', department: 'Management' },
  { name: 'Preethi Rajan', email: 'preethi.rajan@mcl.com', password: 'password123', role: 'employee', department: 'Management' },

  // ─── ERP EMPLOYEES ────────────────────────────
  { name: 'Arun Pillai', email: 'arun.pillai@mcl.com', password: 'password123', role: 'employee', department: 'ERP' },
  { name: 'Vivek Bose', email: 'vivek.bose@mcl.com', password: 'password123', role: 'employee', department: 'ERP' },
  { name: 'Smita Patil', email: 'smita.patil@mcl.com', password: 'password123', role: 'employee', department: 'ERP' },
  { name: 'Sunil Kapoor', email: 'sunil.kapoor@mcl.com', password: 'password123', role: 'employee', department: 'ERP' },
  { name: 'Girish Pawar', email: 'girish.pawar@mcl.com', password: 'password123', role: 'employee', department: 'ERP' },
  { name: 'Vandana Tiwari', email: 'vandana.tiwari@mcl.com', password: 'password123', role: 'employee', department: 'ERP' },

  // ─── P&P EMPLOYEES ────────────────────────────
  { name: 'Kavita Shah', email: 'kavita.shah@mcl.com', password: 'password123', role: 'employee', department: 'P&P' },
  { name: 'Sunita Mishra', email: 'sunita.mishra@mcl.com', password: 'password123', role: 'employee', department: 'P&P' },
  { name: 'Padma Venkat', email: 'padma.venkat@mcl.com', password: 'password123', role: 'employee', department: 'P&P' },
  { name: 'Vinod Chandra', email: 'vinod.chandra@mcl.com', password: 'password123', role: 'employee', department: 'P&P' },
  { name: 'Nalini Subramaniam', email: 'nalini.subramaniam@mcl.com', password: 'password123', role: 'employee', department: 'P&P' },
  { name: 'Mohan Lal', email: 'mohan.lal@mcl.com', password: 'password123', role: 'employee', department: 'P&P' },
];

const assets = [
  { name: 'Dell Laptop', type: 'hardware', serialNumber: 'SN001', status: 'assigned', department: 'IT' },
  { name: 'HP Laptop', type: 'hardware', serialNumber: 'SN002', status: 'assigned', department: 'HR' },
  { name: 'Lenovo ThinkPad', type: 'hardware', serialNumber: 'SN003', status: 'available', department: 'IT' },
  { name: 'MacBook Pro', type: 'hardware', serialNumber: 'SN004', status: 'assigned', department: 'Engineering' },
  { name: 'Dell Monitor 24"', type: 'hardware', serialNumber: 'SN005', status: 'available', department: 'IT' },
  { name: 'HP Monitor 27"', type: 'hardware', serialNumber: 'SN006', status: 'assigned', department: 'Finance' },
  { name: 'Cisco Router', type: 'network', serialNumber: 'SN007', status: 'assigned', department: 'IT' },
  { name: 'Network Switch', type: 'network', serialNumber: 'SN008', status: 'assigned', department: 'IT' },
  { name: 'Canon Printer', type: 'hardware', serialNumber: 'SN009', status: 'maintenance', department: 'HR' },
  { name: 'HP Printer', type: 'hardware', serialNumber: 'SN010', status: 'available', department: 'Finance' },
  { name: 'Microsoft Office', type: 'software', serialNumber: 'SN011', status: 'assigned', department: 'Management' },
  { name: 'AutoCAD', type: 'software', serialNumber: 'SN012', status: 'assigned', department: 'Engineering' },
  { name: 'SAP ERP', type: 'software', serialNumber: 'SN013', status: 'assigned', department: 'ERP' },
  { name: 'Tally Prime', type: 'software', serialNumber: 'SN014', status: 'assigned', department: 'Finance' },
  { name: 'UPS 600VA', type: 'hardware', serialNumber: 'SN015', status: 'available', department: 'IT' },
  { name: 'UPS 1200VA', type: 'hardware', serialNumber: 'SN016', status: 'assigned', department: 'Engineering' },
  { name: 'External HDD 1TB', type: 'hardware', serialNumber: 'SN017', status: 'available', department: 'IT' },
  { name: 'USB Hub', type: 'hardware', serialNumber: 'SN018', status: 'assigned', department: 'HR' },
  { name: 'Webcam HD', type: 'hardware', serialNumber: 'SN019', status: 'assigned', department: 'Management' },
  { name: 'Projector Epson', type: 'hardware', serialNumber: 'SN020', status: 'available', department: 'Management' },
];

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced!');

    // Seed Departments
    console.log('🌱 Seeding departments...');
    for (const deptData of departments) {
      const existing = await Department.findOne({ where: { name: deptData.name } });
      if (!existing) {
        await Department.create(deptData);
        console.log(`✅ Added department: ${deptData.name}`);
      } else {
        console.log(`⏭ Skipped (exists): ${deptData.name}`);
      }
    }

    // Seed Users
    console.log('🌱 Seeding users...');
    for (const userData of users) {
      const existing = await User.findOne({ where: { email: userData.email } });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({ ...userData, password: hashedPassword });
        console.log(`✅ Added: ${userData.name}`);
      } else {
        console.log(`⏭ Skipped (exists): ${userData.name}`);
      }
    }

    // Seed Assets
    console.log('🌱 Seeding assets...');
    for (const assetData of assets) {
      const existing = await Asset.findOne({ where: { serialNumber: assetData.serialNumber } });
      if (!existing) {
        await Asset.create(assetData);
        console.log(`✅ Added asset: ${assetData.name}`);
      } else {
        console.log(`⏭ Skipped (exists): ${assetData.name}`);
      }
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();