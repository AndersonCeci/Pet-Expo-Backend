import { Router } from "express";
const router = Router();
import User from'../models/user.js';
import bycrypt from 'bcrypt'


router.get('/', (req, res) => {
    res.render('home')
})


export { router as homeRouter };
