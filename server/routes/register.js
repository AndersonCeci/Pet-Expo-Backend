import { Router } from "express";
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', (req, res) => {
    res.render('register');
});

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    try{
    const user = await User.findOne({ username });
    if (user) {
        return res.json({ message: "This user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id }, "secret", { expiresIn: '1h' });
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: true,
            maxAge: 3600000 
        });

    res.redirect('/')

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
});

export { router as registerRouter };
