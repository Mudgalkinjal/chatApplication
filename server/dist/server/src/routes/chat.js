"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const router = express_1.default.Router();
router.post('/send', chatController_1.sendMessage);
router.get('/messages', chatController_1.getMessages);
router.get('/getUsers', chatController_1.getUsers);
exports.default = router;
