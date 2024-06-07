import express from 'express';
import cookieParser from 'cookie-parser';

import cors from 'cors';
import mongoose from 'mongoose';
import { dogsRouter } from './routes/dogs.js';
import { loginRouter } from './routes/login.js';
import { registerRouter } from './routes/register.js';
import session from 'express-session';
import { Router } from "express";
import { homeRouter } from './routes/home.js';
import { catsRouter } from './routes/cats.js';
import { birdRouter } from './routes/birds.js';
import methodOverride from 'method-override';
import requireLogin from './middleware/requireLogin.js';
const app = express();

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
})); 
app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());



app.use("/dogs", dogsRouter);
app.use("/login", loginRouter);
app.use('/register', registerRouter);
app.use('/', homeRouter)
app.use('/cats', catsRouter)
app.use('/birds', birdRouter)
app.get('/admin', requireLogin, (req, res) => {
  res.send('Welcome to the admin page!');
});


mongoose.set("strictQuery", true);

app.listen(8080, () => {
  console.log("Express Running");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/animalsExpo")
  .then(() => {
    console.log("Mongoose connected succesfully");
  })
  .catch((err) => {
    console.log("Mongoose error");
    console.log(err);
  });
