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
exports.initBot = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const initBot = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const botId = '65a000000000000000000000';
        const existingBot = yield User_1.User.findById(botId);
        if (!existingBot) {
            console.log('Creating Company Support Bot...');
            const hashedPassword = yield bcryptjs_1.default.hash('defaultpassword', 12);
            yield User_1.User.create({
                _id: new mongoose_1.default.Types.ObjectId(botId),
                name: 'Company Support Bot',
                email: 'support@yourapp.com',
                password: hashedPassword,
                isBot: true,
                isVerified: true,
                friends: [],
            });
            console.log('Company Support Bot created successfully.');
        }
        else {
            console.log('Company Support Bot already exists.');
        }
    }
    catch (error) {
        console.error('Error initializing bot:', error);
        throw error;
    }
});
exports.initBot = initBot;
