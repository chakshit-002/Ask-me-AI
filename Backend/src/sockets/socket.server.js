const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const messageModel = require('../models/message.model');
const cookie = require('cookie');
const aiService = require("../services/ai.service");
const {createMemory, queryMemory} = require("../services/vector.service")


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
                const message = await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                });

                //vector creation 
                const vectors = await aiService.generateVectors(messagePayload.content);
                console.log("vectors generated",vectors);

                const memory = await queryMemory({
                    queryVector : vectors,
                    limit:3,
                    metadata:{}
                })

                // saving  in vector memory 
                await createMemory({
                    vectors,
                    messageId: message._id,
                    metadata:{
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        text: messagePayload.content
                    }
                })
                console.log("memory fetched",memory);

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
                    const responseMessage = await messageModel.create({
                        chat: messagePayload.chat,
                        user: socket.user._id,
                        content: response,
                        role: "model"
                    });

                    // convert response in vector and saving response  in vector memory 
                    const responseVectors = await aiService.generateVectors(response);
                    await createMemory({
                        vectors: responseVectors,
                        messageId: responseMessage._id,
                        metadata:{
                            chat:messagePayload.chat,
                            user:socket.user._id,
                            text:response
                        }
                    })

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