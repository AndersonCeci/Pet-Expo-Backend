import { Router } from "express";
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
const router = Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        req.session.user_id = user._id;

        const token = jwt.sign({ id: user._id }, "secret", { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 });

        res.redirect('/')
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        } else {
            res.clearCookie('token');
            res.redirect('/login');
        }
    });
});

router.get('/verify', (req, res) => {
    if (req.session.user_id) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

export { router as loginRouter };
