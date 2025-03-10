import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

type onlineUserType = {
    _id: string;
    socketID: string;
};

let onlineUsers: onlineUserType[] = [];

export const findOnlineUserSocketID = (_id: string) => {
    const socketID = onlineUsers.find((user) => user._id === _id);

    if (!socketID) {
        return null;
    }

    return socketID;
};

io.on("connection", (socket) => {
    console.log("C", socket.id);

    const _id = socket.handshake.query._id as string;
    if (_id) {
        onlineUsers.push({ _id: _id, socketID: socket.id });
    }

    socket.on("disconnect", () => {
        console.log("D", socket.id);
        onlineUsers = onlineUsers.filter((user) => user.socketID !== socket.id);
    });
});

export { app, server, io };
