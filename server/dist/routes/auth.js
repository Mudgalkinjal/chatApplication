"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const transporter_1 = __importDefault(require("../config/transporter"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Example route
router.get('/', (req, res) => {
    res.send('Auth endpoint is working');
});
// Sign Up Route
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
        });
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET || 'your_secret', {
            expiresIn: '1h',
        });
        const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
        const mailOptions = {
            from: 'noreply@yourapp.com',
            to: email,
            subject: 'Verify Your Email Address',
            html: `
          <h1>Email Verification</h1>
          <p>Hello ${name},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 1 hour.</p>
        `,
        };
        yield transporter_1.default.sendMail(mailOptions);
        yield newUser.save();
        res.status(201).json({ message: 'Verification email sent' });
    }
    catch (error) {
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.get('/verify-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (!token) {
        return res.redirect('http://localhost:3000/verify-email?status=error');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_secret');
        const email = decoded.email;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.redirect('http://localhost:3000/verify-email?status=user-not-found');
        }
        if (user.isVerified) {
            return res.redirect('http://localhost:3000/verify-email?status=already-verified');
        }
        user.isVerified = true;
        yield user.save();
        return res.redirect('http://localhost:3000/verify-email?status=success');
    }
    catch (error) {
        return res.redirect('http://localhost:3000/verify-email?status=invalid-token');
    }
}));
// Sign In Route
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your_secret', { expiresIn: '1h' } // Token expires in 1 hour
        );
        res.status(200).json({ token });
    }
    catch (error) {
        console.error('Error during sign in:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.get('/protected', authMiddleware_1.default, (req, res) => {
    res.json({
        message: 'Access granted',
        user: req.user,
    });
});
exports.default = router;
