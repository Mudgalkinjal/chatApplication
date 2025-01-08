"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com', // Should be smtp.gmail.com
    port: parseInt(process.env.SMTP_PORT || '587'), // 587 for TLS
    secure: false, // false for port 587
    auth: {
        user: 'kinjalmudgal89@gmail.com', // Your Gmail email address
        pass: 'dqrzithgwjdzmngm', // Gmail App Password
    },
});
exports.default = transporter;
