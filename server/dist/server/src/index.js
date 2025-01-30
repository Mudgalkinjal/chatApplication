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
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("./models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const chat_1 = __importDefault(require("./routes/chat"));
const friends_1 = __importDefault(require("./routes/friends"));
const transporter_1 = __importDefault(require("./config/transporter"));
transporter_1.default.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
    }
    else {
        console.log('SMTP connection successful:', success);
    }
});
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const allowedOrigins = ['http://localhost:3000', process.env.CLIENT_URL];
const io = new socket_io_1.Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
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
app.use('/api/auth', auth_1.default);
app.use('/api/chat', chat_1.default);
app.use('/api/friends', friends_1.default);
app.get('/', (req, res) => {
    res.send('Server is running');
});
mongoose_1.default
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chatapp')
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('MongoDB connected');
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
}))
    .catch((err) => console.error('MongoDB connection error:', err));
const PORT = 5001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
