const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const messageModel = require('../models/message.model');
const cookie = require('cookie');
const aiService = require("../services/ai.service");

async function initSocketServer(httpServer) {

    const io = new Server(httpServer, {});

    // --- Middleware,  authentication krege idhar ham
    io.use(async (socket, next) => {
        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');

            if (!cookies.token) {
                return next(new Error("Authentication error: No token provided"));
            }

            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id).select("-password"); // Password exclude kr diya hai

            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            console.error("Socket Auth Middleware Error:", err.message);
            return next(new Error("Authentication error: Invalid or expired token"));
        }
    });

    io.on('connection', (socket) => {
        console.log("Connected User:", socket.user.fullName);

        socket.on("ai_message", async (messagePayload) => {
            try {
                // 1. Basic Validation
                if (!messagePayload.content || !messagePayload.chat) {
                    return socket.emit("error_message", { message: "Content and Chat ID are required" });
                }

                // 2. Save User Message DB mei
                await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                });

                // 3. Get History for Context
               const chatHistory = (await messageModel.find({chat: messagePayload.chat}).sort({createdAt: -1}).limit(20).lean()).reverse();

                // 4. Generate AI Response with Specific Error Catching
                let response;
                try {
                    response = await aiService.generateResponse(chatHistory.map(item => ({
                        role: item.role,
                        parts: [{ text: item.content }]
                    })));
                } catch (aiErr) {
                    console.error("Gemini API Error:", aiErr.message);
                    return socket.emit("ai_response", {
                        content: "Bhai, AI thoda thak gaya hai (Quota Limit). Thodi der baad try karo!",
                        chat: messagePayload.chat
                    });
                }

                // 5. Save and Emit AI Response
                if (response) {
                    await messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: response,
                        role: "model"
                    });

                    socket.emit("ai_response", {
                        content: response,
                        chat: messagePayload.chat
                    });
                }

            } catch (err) {
                console.error("Internal Socket Event Error:", err);
                socket.emit("error_message", { message: "Internal server error occurred" });
            }
        });

        socket.on('disconnect', () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = initSocketServer;