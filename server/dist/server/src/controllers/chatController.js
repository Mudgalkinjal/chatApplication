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
exports.getUsers = exports.getMessages = exports.sendMessage = void 0;
const Chat_1 = require("../models/Chat");
const User_1 = require("../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender, receiver, message } = req.body;
        if (!sender || !receiver || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(sender) ||
            !mongoose_1.default.Types.ObjectId.isValid(receiver)) {
            return res
                .status(400)
                .json({ error: 'Invalid sender or receiver ID format' });
        }
        const chat = new Chat_1.Chat({
            sender: new mongoose_1.default.Types.ObjectId(sender),
            receiver: new mongoose_1.default.Types.ObjectId(receiver),
            message,
        });
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
        const user1 = req.query.user1;
        const user2 = req.query.user2;
        console.log('Received user1:', user1);
        console.log('Received user2:', user2);
        if (!user1 || !user2) {
            return res
                .status(400)
                .json({ error: 'Both user1 and user2 are required' });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(user1) ||
            !mongoose_1.default.Types.ObjectId.isValid(user2)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        const messages = yield Chat_1.Chat.find({
            $or: [
                {
                    sender: new mongoose_1.default.Types.ObjectId(user1),
                    receiver: new mongoose_1.default.Types.ObjectId(user2),
                },
                {
                    sender: new mongoose_1.default.Types.ObjectId(user2),
                    receiver: new mongoose_1.default.Types.ObjectId(user1),
                },
            ],
        }).sort({ timestamp: 1 });
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
        const user = yield User_1.User.findById(user1).populate('friends', 'name email _id');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user.friends || []);
    }
    catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});
exports.getUsers = getUsers;
