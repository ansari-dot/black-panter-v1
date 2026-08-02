import { Server } from 'socket.io';

let io;

export const initSocket = (server, options) => {
  io = new Server(server, options);
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
};
