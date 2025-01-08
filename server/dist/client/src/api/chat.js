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
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
// Send a Message
const sendMessage = (sender, receiver, message) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, receiver, message }),
    });
    return response.json();
});
exports.sendMessage = sendMessage;
// Get Messages
const getMessages = (user1, user2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${API_URL}/api/chat/messages?user1=${user1}&user2=${user2}`);
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        const data = yield response.json();
        return data; // Return fetched messages
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
});
exports.getMessages = getMessages;
const getUsers = (user1) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_URL}/api/chat/getUsers?user1=${user1}`);
    const data = yield response.json(); // Parse the response body only once
    console.log('Fetched Users:', data); // Log the parsed data
    return data;
});
exports.getUsers = getUsers;
