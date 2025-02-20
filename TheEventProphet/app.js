//require modules
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const multer  = require('multer');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session =  require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); 
const mainRoutes = require('./routes/mainRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const {fileUpload} = require('./middleware/fileUpload');

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
// let url = 'mongodb://localhost:27017/demos';
app.set('view engine', 'ejs');
const mongUri = 'mongodb+srv://admin:admin123@cluster0.szblo.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0';

// connecting to mongodb
// mongoose.connect('mongodb://localhost:27017/project')
mongoose.connect(mongUri)
.then(() => {
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));

app.use(session({
    secret: 'abcdefghijklmnopqrstuvwxyz',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge:60*60*10000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/project'})
}));

app.use(flash())
app.use((req,res,next)=> {
    res.locals.user = req.session.user||null;
    res.locals.successMessages=req.flash('success');
    res.locals.errorMessages=req.flash('error');
    next();
})

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use('/', mainRoutes);
app.use('/event', eventRoutes);
app.use('/users', userRoutes );

app.use((req, res, next)=>{
    let err = new Error('The server cannot locate: ' + req.url)
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error!");
    }
    res.status(err.status);
    res.render('error', {error: err});
});
