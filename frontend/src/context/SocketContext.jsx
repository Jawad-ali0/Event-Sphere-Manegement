import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io as ioClient } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const url = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const socket = ioClient(url, { auth: { token }, autoConnect: true });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinExpo = (expoId) => {
    if (socketRef.current && expoId) {
      socketRef.current.emit('join-expo', expoId);
    }
  };

  const sendChatMessage = (expoId, message, from) => {
    if (socketRef.current && expoId) {
      socketRef.current.emit('chat:message', { expoId, message, from });
    }
  };

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinExpo, sendChatMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;