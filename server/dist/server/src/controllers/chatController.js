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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getMessages = exports.sendMessage = void 0;
const Chat_1 = require("../models/Chat");
const User_1 = require("../models/User");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender, receiver, message } = req.body;
        if (!sender || !receiver || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const chat = new Chat_1.Chat({ sender, receiver, message });
        yield chat.save();
        res.status(201).json(chat);
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user1, user2 } = req.query;
        const messages = yield Chat_1.Chat.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }, // Include messages where user1 is the receiver
            ],
        }).sort({ timestamp: 1 }); // Sort by timestamp for chronological order
        res.status(200).json(messages);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
exports.getMessages = getMessages;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user1 } = req.query;
        if (!user1) {
            return res.status(400).json({ error: 'user1Id is required' });
        }
        // Find all users except the one matching user1Id
        const users = yield User_1.User.find({
            _id: { $ne: user1 }, // Exclude the logged-in user
            isVerified: true, // Only include verified users
        });
        res.status(200).json(users || []);
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
exports.getUsers = getUsers;
