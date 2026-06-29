const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const assetRoutes = require('./routes/assetRoutes'); 
const ticketRoutes = require('./routes/ticketRoutes');
const documentRoutes = require('./routes/documentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const transferRoutes = require('./routes/transferRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const profileRoutes = require('./routes/profileRoutes');
const deptRoutes = require('./routes/deptRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const requestRoutes = require('./routes/requestRoutes');
const reportRoutes = require('./routes/reportRoutes');


const app = express();
app.get('/test', (req, res) => res.send('Server is working!'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes); 
app.use('/', assetRoutes); 
app.use('/', ticketRoutes);
app.use('/', documentRoutes);
app.use('/', adminRoutes);
app.use('/', transferRoutes);
app.use('/', maintenanceRoutes);
app.use('/', profileRoutes);
app.use('/', deptRoutes);
app.use('/', superAdminRoutes);
app.use('/', requestRoutes);
app.use('/', reportRoutes);


// DB connection + start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected!');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ DB Connection Error:', err));