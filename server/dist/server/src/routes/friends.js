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
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.post('/add-friend', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, friendId } = req.body;
    if (!userId || !friendId) {
        return res
            .status(400)
            .json({ error: 'Both userId and friendId are required' });
    }
    try {
        yield User_1.User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } });
        yield User_1.User.findByIdAndUpdate(friendId, { $addToSet: { friends: userId } });
        res.json({ message: 'Friend added successfully!' });
    }
    catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Failed to add friend' });
    }
}));
router.get('/friends/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.params.userId).populate('friends', 'name email');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user.friends);
    }
    catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
}));
exports.default = router;
