const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

// session 
app.use(session({
    secret:'l654fd5dfkjdklsfjd',
    resave:true,
    saveUninitialized:true
}));

// flash message
app.use(flash());

// middlware for flash messages
app.use((req, res, next) => {
    res.locals.errors = req.flash('errors') || [];
    res.locals.successMessage = req.flash('success')[0] || null;
    next();
});

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// views
app.set('views', path.join(__dirname, 'src', 'views'));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.get('/', (req, res) => {
    res.redirect('/api/auth');
});


// routers
const userRouter = require('./src/router/user');
const authRoutes = require('./src/router/authRoutes');

app.use('/users', userRouter);
app.use('/api/auth', authRoutes);

module.exports = app;

