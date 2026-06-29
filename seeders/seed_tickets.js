require('dotenv').config();
const sequelize = require('../config/db');
const { Ticket, User, Asset, Department } = require('../models/index');

// ─── TICKETS ──────────────────────────────────────────────────────────────────
// Fields match your Ticket model exactly:
//   raisedBy        → INTEGER (user id)
//   assignedTo      → INTEGER (user id, nullable)
//   assignedAssetId → INTEGER (asset id, nullable)
//   department      → STRING
//   deptAdminStatus / superAdminStatus → 'pending' | 'approved' | 'rejected'

const ticketData = [

  // ─── IT ───────────────────────────────────────────────────────────────────
  {
    title: 'Laptop not booting after Windows update',
    description: 'My Dell Laptop (SN001) shows a black screen after the latest Windows update. Tried restarting multiple times.',
    priority: 'high', category: 'hardware', status: 'resolved',
    raisedByEmail: 'neha.gupta@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN001', department: 'IT',
    deptAdminStatus: 'approved', deptAdminNote: 'Verified. Sent to IT team.',
    superAdminStatus: 'approved', superAdminNote: 'Approved for immediate resolution.',
    resolvedAt: new Date('2024-04-03'), createdAt: new Date('2024-04-02'), updatedAt: new Date('2024-04-03'),
  },
  {
    title: 'Cannot connect to office Wi-Fi',
    description: 'Lenovo ThinkPad (SN003) refuses to connect to the office network since yesterday. Other laptops on same desk connect fine.',
    priority: 'medium', category: 'network', status: 'resolved',
    raisedByEmail: 'deepak.rao@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN003', department: 'IT',
    deptAdminStatus: 'approved', deptAdminNote: 'Confirmed network issue on this device.',
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-04-05'), createdAt: new Date('2024-04-05'), updatedAt: new Date('2024-04-05'),
  },
  {
    title: 'UPS making beeping noise continuously',
    description: 'UPS 600VA (SN015) keeps beeping every 30 seconds. Concerned it may fail during work hours.',
    priority: 'medium', category: 'hardware', status: 'in_progress',
    raisedByEmail: 'anita.kulkarni@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN015', department: 'IT',
    deptAdminStatus: 'approved', deptAdminNote: 'Approved. IT team checking battery.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-10'), updatedAt: new Date('2024-05-11'),
  },
  {
    title: 'External HDD not detected on any port',
    description: 'External HDD 1TB (SN017) is not recognised on any USB port. Was working fine last week.',
    priority: 'low', category: 'hardware', status: 'open',
    raisedByEmail: 'harish.dubey@mcl.com', assignedToEmail: null,
    assetSerial: 'SN017', department: 'IT',
    deptAdminStatus: 'pending', deptAdminNote: null,
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-14'), updatedAt: new Date('2024-05-14'),
  },
  {
    title: 'Network Switch port 6 dead',
    description: 'Switch (SN008) port 6 seems dead. Connected desktop gets no network even after cable replacement.',
    priority: 'high', category: 'network', status: 'in_progress',
    raisedByEmail: 'nitin.desai@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN008', department: 'IT',
    deptAdminStatus: 'approved', deptAdminNote: 'Confirmed port failure.',
    superAdminStatus: 'approved', superAdminNote: 'Replacement switch being arranged.',
    resolvedAt: null, createdAt: new Date('2024-05-13'), updatedAt: new Date('2024-05-14'),
  },
  {
    title: 'Cisco Router admin panel inaccessible',
    description: 'Cannot access Cisco Router (SN007) admin panel. Credentials were rotated and not shared with team.',
    priority: 'critical', category: 'network', status: 'open',
    raisedByEmail: 'santosh.kumar@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN007', department: 'IT',
    deptAdminStatus: 'approved', deptAdminNote: 'Escalated to superadmin for credentials.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-15'), updatedAt: new Date('2024-05-15'),
  },
  {
    title: 'Dell Monitor flickering intermittently',
    description: 'Dell Monitor 24" (SN005) flickers every few minutes. Tried changing HDMI cable but problem persists.',
    priority: 'low', category: 'hardware', status: 'resolved',
    raisedByEmail: 'asha.malhotra@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN005', department: 'IT',
    deptAdminStatus: 'approved', deptAdminNote: null,
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-04-21'), createdAt: new Date('2024-04-20'), updatedAt: new Date('2024-04-21'),
  },

  // ─── HR ───────────────────────────────────────────────────────────────────
  {
    title: 'HP Laptop screen cracked',
    description: 'HP Laptop (SN002) screen cracked after falling from desk. Requesting replacement or repair.',
    priority: 'high', category: 'hardware', status: 'in_progress',
    raisedByEmail: 'suresh.reddy@mcl.com', assignedToEmail: 'priya.patel@mcl.com',
    assetSerial: 'SN002', department: 'HR',
    deptAdminStatus: 'approved', deptAdminNote: 'Damage confirmed. Sent for repair quote.',
    superAdminStatus: 'approved', superAdminNote: 'Approved repair up to Rs.8000.',
    resolvedAt: null, createdAt: new Date('2024-05-08'), updatedAt: new Date('2024-05-09'),
  },
  {
    title: 'Canon Printer showing offline on all PCs',
    description: 'Canon Printer (SN009) shows offline status on all computers in HR wing. Last printed 3 days ago.',
    priority: 'medium', category: 'hardware', status: 'resolved',
    raisedByEmail: 'sanjay.tiwari@mcl.com', assignedToEmail: 'priya.patel@mcl.com',
    assetSerial: 'SN009', department: 'HR',
    deptAdminStatus: 'approved', deptAdminNote: null,
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-04-16'), createdAt: new Date('2024-04-15'), updatedAt: new Date('2024-04-16'),
  },
  {
    title: 'USB Hub not recognising devices after power cut',
    description: 'USB Hub (SN018) stopped detecting mouse and keyboard after a power outage.',
    priority: 'low', category: 'hardware', status: 'resolved',
    raisedByEmail: 'prakash.yadav@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN018', department: 'HR',
    deptAdminStatus: 'approved', deptAdminNote: null,
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-04-28'), createdAt: new Date('2024-04-28'), updatedAt: new Date('2024-04-28'),
  },
  {
    title: 'Unable to access HRMS portal — 403 error',
    description: 'Getting "403 Forbidden" when logging into HRMS portal. Multiple team members affected.',
    priority: 'high', category: 'software', status: 'open',
    raisedByEmail: 'rekha.srivastava@mcl.com', assignedToEmail: null,
    assetSerial: null, department: 'HR',
    deptAdminStatus: 'approved', deptAdminNote: 'Multiple users affected. Urgent fix needed.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-15'), updatedAt: new Date('2024-05-15'),
  },
  {
    title: 'Outlook not syncing emails since morning',
    description: 'Outlook stopped syncing new emails since this morning. Tried restarting but no change.',
    priority: 'medium', category: 'software', status: 'in_progress',
    raisedByEmail: 'hemant.jain@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: null, department: 'HR',
    deptAdminStatus: 'approved', deptAdminNote: 'IT team investigating.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-14'), updatedAt: new Date('2024-05-15'),
  },

  // ─── FINANCE ──────────────────────────────────────────────────────────────
  {
    title: 'Tally Prime license expired — urgent month-end',
    description: 'Tally Prime (SN014) showing license expired. Cannot open company data. Month-end closing is today.',
    priority: 'critical', category: 'software', status: 'resolved',
    raisedByEmail: 'anjali.das@mcl.com', assignedToEmail: 'amit.kumar@mcl.com',
    assetSerial: 'SN014', department: 'Finance',
    deptAdminStatus: 'approved', deptAdminNote: 'Critical. Escalated immediately.',
    superAdminStatus: 'approved', superAdminNote: 'Approved license renewal on priority.',
    resolvedAt: new Date('2024-04-30'), createdAt: new Date('2024-04-30'), updatedAt: new Date('2024-04-30'),
  },
  {
    title: 'HP Monitor display going blank randomly',
    description: 'HP Monitor 27" (SN006) randomly goes blank for a few seconds every hour. Disrupting accounting work.',
    priority: 'medium', category: 'hardware', status: 'resolved',
    raisedByEmail: 'ritu.agarwal@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN006', department: 'Finance',
    deptAdminStatus: 'approved', deptAdminNote: null,
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-04-11'), createdAt: new Date('2024-04-10'), updatedAt: new Date('2024-04-11'),
  },
  {
    title: 'HP Printer out of toner',
    description: 'HP Printer (SN010) showing toner empty. Need replacement to print financial statements.',
    priority: 'medium', category: 'hardware', status: 'open',
    raisedByEmail: 'lakshmi.menon@mcl.com', assignedToEmail: null,
    assetSerial: 'SN010', department: 'Finance',
    deptAdminStatus: 'approved', deptAdminNote: 'Procurement request raised.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-15'), updatedAt: new Date('2024-05-15'),
  },
  {
    title: 'Excel crashing on files above 20MB',
    description: 'MS Excel crashes when opening files above 20MB. Losing unsaved work frequently.',
    priority: 'high', category: 'software', status: 'in_progress',
    raisedByEmail: 'ashok.bhatt@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: null, department: 'Finance',
    deptAdminStatus: 'approved', deptAdminNote: null,
    superAdminStatus: 'approved', superAdminNote: 'Approved RAM upgrade check.',
    resolvedAt: null, createdAt: new Date('2024-05-12'), updatedAt: new Date('2024-05-13'),
  },

  // ─── ENGINEERING ──────────────────────────────────────────────────────────
  {
    title: 'AutoCAD license not activating after reformat',
    description: 'AutoCAD (SN012) showing "License checkout failed" after system reformat. Project deadline is tomorrow.',
    priority: 'critical', category: 'software', status: 'resolved',
    raisedByEmail: 'kiran.joshi@mcl.com', assignedToEmail: 'sneha.verma@mcl.com',
    assetSerial: 'SN012', department: 'Engineering',
    deptAdminStatus: 'approved', deptAdminNote: 'Critical. Deadline tomorrow.',
    superAdminStatus: 'approved', superAdminNote: 'Approved. Reactivate via Autodesk portal.',
    resolvedAt: new Date('2024-04-08'), createdAt: new Date('2024-04-08'), updatedAt: new Date('2024-04-08'),
  },
  {
    title: 'MacBook Pro overheating during rendering',
    description: 'MacBook Pro (SN004) gets very hot during rendering. Fan at full speed constantly.',
    priority: 'high', category: 'hardware', status: 'in_progress',
    raisedByEmail: 'manoj.pandey@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN004', department: 'Engineering',
    deptAdminStatus: 'approved', deptAdminNote: 'Sent for thermal inspection.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-11'), updatedAt: new Date('2024-05-12'),
  },
  {
    title: 'UPS 1200VA not switching to battery on power cut',
    description: 'UPS 1200VA (SN016) did not switch to battery during power cut. Lost 2 hours of CAD work.',
    priority: 'high', category: 'hardware', status: 'resolved',
    raisedByEmail: 'rohit.saxena@mcl.com', assignedToEmail: 'sneha.verma@mcl.com',
    assetSerial: 'SN016', department: 'Engineering',
    deptAdminStatus: 'approved', deptAdminNote: null,
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-04-23'), createdAt: new Date('2024-04-22'), updatedAt: new Date('2024-04-23'),
  },
  {
    title: 'AutoCAD setup needed for new team member Aditya',
    description: 'New joiner Aditya Verma needs AutoCAD license and full workstation setup.',
    priority: 'medium', category: 'software', status: 'open',
    raisedByEmail: 'divya.krishnan@mcl.com', assignedToEmail: null,
    assetSerial: null, department: 'Engineering',
    deptAdminStatus: 'approved', deptAdminNote: 'Confirmed new joiner.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-15'), updatedAt: new Date('2024-05-15'),
  },

  // ─── MANAGEMENT ───────────────────────────────────────────────────────────
  {
    title: 'Projector not connecting — board meeting in 2 hours',
    description: 'Epson Projector (SN020) not detecting laptop via HDMI in Conference Room A. Board meeting is imminent.',
    priority: 'critical', category: 'hardware', status: 'resolved',
    raisedByEmail: 'meena.iyer@mcl.com', assignedToEmail: 'vikram.singh@mcl.com',
    assetSerial: 'SN020', department: 'Management',
    deptAdminStatus: 'approved', deptAdminNote: 'Urgent — meeting in 2 hours.',
    superAdminStatus: 'approved', superAdminNote: 'Highest priority.',
    resolvedAt: new Date('2024-04-18'), createdAt: new Date('2024-04-18'), updatedAt: new Date('2024-04-18'),
  },
  {
    title: 'Webcam not detected in Microsoft Teams',
    description: 'Webcam HD (SN019) not detected in Teams. Shows "No camera found" during all video calls.',
    priority: 'medium', category: 'hardware', status: 'resolved',
    raisedByEmail: 'geeta.nambiar@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: 'SN019', department: 'Management',
    deptAdminStatus: 'approved', deptAdminNote: null,
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-05-02'), createdAt: new Date('2024-05-02'), updatedAt: new Date('2024-05-02'),
  },
  {
    title: 'Microsoft Office activation failed after laptop swap',
    description: 'Office shows "Product deactivated" after laptop replacement. Need re-activation with company license.',
    priority: 'high', category: 'software', status: 'in_progress',
    raisedByEmail: 'usha.chatterjee@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: null, department: 'Management',
    deptAdminStatus: 'approved', deptAdminNote: 'Swap confirmed. Reactivation needed.',
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-13'), updatedAt: new Date('2024-05-14'),
  },

  // ─── ERP ──────────────────────────────────────────────────────────────────
  {
    title: 'SAP ERP login failing for multiple users',
    description: 'SAP (SN013) login failing for 4 team members since morning. Getting "System not available" error.',
    priority: 'critical', category: 'software', status: 'in_progress',
    raisedByEmail: 'arun.pillai@mcl.com', assignedToEmail: 'rajesh.nair@mcl.com',
    assetSerial: 'SN013', department: 'ERP',
    deptAdminStatus: 'approved', deptAdminNote: '4 users locked out. Escalated.',
    superAdminStatus: 'approved', superAdminNote: 'IT team on it. ETA 2 hours.',
    resolvedAt: null, createdAt: new Date('2024-05-15'), updatedAt: new Date('2024-05-15'),
  },
  {
    title: 'SAP work process showing 90% load',
    description: 'SAP ERP work process monitor showing 90% load. System very slow for all users.',
    priority: 'high', category: 'software', status: 'resolved',
    raisedByEmail: 'vivek.bose@mcl.com', assignedToEmail: 'rajesh.nair@mcl.com',
    assetSerial: 'SN013', department: 'ERP',
    deptAdminStatus: 'approved', deptAdminNote: null,
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-04-25'), createdAt: new Date('2024-04-25'), updatedAt: new Date('2024-04-25'),
  },
  {
    title: 'New SAP user ID needed for Girish Pawar',
    description: 'New joiner Girish Pawar needs SAP user ID with MM module access.',
    priority: 'medium', category: 'software', status: 'resolved',
    raisedByEmail: 'smita.patil@mcl.com', assignedToEmail: 'rajesh.nair@mcl.com',
    assetSerial: null, department: 'ERP',
    deptAdminStatus: 'approved', deptAdminNote: 'Confirmed new joiner.',
    superAdminStatus: 'approved', superAdminNote: 'Approved MM module access.',
    resolvedAt: new Date('2024-04-12'), createdAt: new Date('2024-04-12'), updatedAt: new Date('2024-04-12'),
  },
  {
    title: 'SAP monthly procurement report timing out',
    description: 'Monthly procurement report times out after 20 minutes. Needed for management review tomorrow.',
    priority: 'high', category: 'software', status: 'open',
    raisedByEmail: 'sunil.kapoor@mcl.com', assignedToEmail: null,
    assetSerial: 'SN013', department: 'ERP',
    deptAdminStatus: 'approved', deptAdminNote: 'Report needed for management.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-14'), updatedAt: new Date('2024-05-14'),
  },

  // ─── P&P ──────────────────────────────────────────────────────────────────
  {
    title: 'Access denied on shared policy documents drive',
    description: 'Getting "Access Denied" on shared network drive with all P&P documents. Was working last week.',
    priority: 'high', category: 'network', status: 'resolved',
    raisedByEmail: 'kavita.shah@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: null, department: 'P&P',
    deptAdminStatus: 'approved', deptAdminNote: 'All P&P users affected.',
    superAdminStatus: 'approved', superAdminNote: null,
    resolvedAt: new Date('2024-04-17'), createdAt: new Date('2024-04-17'), updatedAt: new Date('2024-04-17'),
  },
  {
    title: 'Laptop battery draining in under 2 hours',
    description: 'Battery drains from 100% to 20% in under 2 hours even with light usage. Need replacement.',
    priority: 'low', category: 'hardware', status: 'open',
    raisedByEmail: 'sunita.mishra@mcl.com', assignedToEmail: null,
    assetSerial: null, department: 'P&P',
    deptAdminStatus: 'pending', deptAdminNote: null,
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-13'), updatedAt: new Date('2024-05-13'),
  },
  {
    title: 'VPN disconnects every 30 minutes while WFH',
    description: 'VPN drops every 30 minutes while working from home. Have to reconnect manually each time.',
    priority: 'medium', category: 'network', status: 'in_progress',
    raisedByEmail: 'padma.venkat@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: null, department: 'P&P',
    deptAdminStatus: 'approved', deptAdminNote: 'WFH user. VPN config review needed.',
    superAdminStatus: 'pending', superAdminNote: null,
    resolvedAt: null, createdAt: new Date('2024-05-10'), updatedAt: new Date('2024-05-11'),
  },
  {
    title: 'Laptop request for new analyst Mohan Lal',
    description: 'New analyst Mohan Lal joining June 1. Requesting laptop with Office, Teams, and VPN setup.',
    priority: 'low', category: 'other', status: 'resolved',
    raisedByEmail: 'vinod.chandra@mcl.com', assignedToEmail: 'rahul.sharma@mcl.com',
    assetSerial: null, department: 'P&P',
    deptAdminStatus: 'approved', deptAdminNote: 'Joining confirmed June 1.',
    superAdminStatus: 'approved', superAdminNote: 'Approved. Assign from available stock.',
    resolvedAt: new Date('2024-05-07'), createdAt: new Date('2024-05-05'), updatedAt: new Date('2024-05-07'),
  },
];

// ─── SEEDER FUNCTION ──────────────────────────────────────────────────────────
const seedTickets = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced!\n');

    let success = 0, skipped = 0;

    for (const t of ticketData) {
      // 1. raisedBy email → user id
      const raiser = await User.findOne({ where: { email: t.raisedByEmail } });
      if (!raiser) {
        console.warn(`⚠  Skipped — user not found: ${t.raisedByEmail}`);
        skipped++; continue;
      }

      // 2. assignedTo email → user id (nullable)
      let assignee = null;
      if (t.assignedToEmail) {
        assignee = await User.findOne({ where: { email: t.assignedToEmail } });
      }

      // 3. asset serial → asset id (nullable)
      let asset = null;
      if (t.assetSerial) {
        asset = await Asset.findOne({ where: { serialNumber: t.assetSerial } });
      }

      await Ticket.create({
        title:            t.title,
        description:      t.description,
        priority:         t.priority,
        category:         t.category,
        status:           t.status,
        raisedBy:         raiser.id,
        assignedTo:       assignee?.id    || null,
        assignedAssetId:  asset?.id       || null,
        department:       t.department,
        deptAdminStatus:  t.deptAdminStatus,
        deptAdminNote:    t.deptAdminNote  || null,
        superAdminStatus: t.superAdminStatus,
        superAdminNote:   t.superAdminNote || null,
        resolvedAt:       t.resolvedAt    || null,
        createdAt:        t.createdAt,
        updatedAt:        t.updatedAt,
      });

      console.log(`✅ [${t.priority.toUpperCase().padEnd(8)}] ${t.status.padEnd(12)} — ${t.title}`);
      success++;
    }

    console.log(`\n🎉 Done! ${success} tickets seeded, ${skipped} skipped.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedTickets();