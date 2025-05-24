import React, { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

const socket = io(import.meta.env.VITE_BASE_URL);

export const SocketProvider = ({ children }) => {
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};