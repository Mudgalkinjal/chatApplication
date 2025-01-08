"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const chat_1 = __importDefault(require("./routes/chat"));
const transporter_1 = __importDefault(require("./config/transporter"));
// Load environment variables
dotenv_1.default.config();
//process.env.CLIENT_URL
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
transporter_1.default.verify((error, success) => {
    console.log('in transporter');
    if (error) {
        console.error('SMTP connection error:', error);
    }
    else {
        console.log('SMTP connection successful:', success);
    }
});
// Mount routes
app.use('/api/auth', auth_1.default);
app.use('/api/chat', chat_1.default);
// Health Check Route
app.get('/', (req, res) => {
    res.send('Server is running');
});
const PORT = 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
