import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })); 
  
const requireLogin  = (req, res, next) => {
    if(!req.session.user_id){
       return res.redirect('/login')
    }
    next();
}

export default requireLogin;
