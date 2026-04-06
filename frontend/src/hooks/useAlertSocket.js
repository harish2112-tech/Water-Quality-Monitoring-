import { useState, useEffect, useRef } from 'react';

const WEBSOCKET_URL = 'ws://localhost:8000/ws/alerts';

export const useAlertSocket = (onMessageReceived) => {
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const maxRetries = 5;
    const wsRef = useRef(null);
    const callbackRef = useRef(onMessageReceived);

    // Update callback ref when callback changes
    useEffect(() => {
        callbackRef.current = onMessageReceived;
    }, [onMessageReceived]);

    useEffect(() => {
        let reconnectTimeoutId = null;

        const connect = () => {
            if (reconnectAttempts >= maxRetries) {
                console.warn(`WebSocket reconnection failed after ${maxRetries} attempts.`);
                return;
            }

            try {
                // Determine the correct connection URL
                // If hosted securely, use wss. Defaulting to ws://localhost:8000/ws/alerts for local.
                const socketUrl = WEBSOCKET_URL;
                const ws = new WebSocket(socketUrl);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('Connected to Alerts WebSocket');
                    setIsConnected(true);
                    setReconnectAttempts(0); // Reset retries on successful connection
                };

                ws.onmessage = (event) => {
                    try {
                        const newAlert = JSON.parse(event.data);
                        if (callbackRef.current) {
                            callbackRef.current(newAlert);
                        }
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                };

                ws.onclose = (event) => {
                    console.log('WebSocket connection closed', event.reason);
                    setIsConnected(false);
                    
                    // Attempt to reconnect if not closed normally (1000) inside retry limit
                    if (event.code !== 1000 && reconnectAttempts < maxRetries) {
                        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000); // Exponential backoff up to 10s
                        console.log(`Attempting to reconnect in ${timeout}ms...`);
                        reconnectTimeoutId = setTimeout(() => {
                            setReconnectAttempts(prev => prev + 1);
                        }, timeout);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket encountered error:', error);
                    ws.close();
                };

            } catch (err) {
                console.error("Failed to construct WebSocket", err);
            }
        };

        connect();

        return () => {
            if (reconnectTimeoutId) clearTimeout(reconnectTimeoutId);
            if (wsRef.current) {
                // Ensure we don't trigger the auto-reconnect logic when forcefully unmounting
                wsRef.current.onclose = null;
                wsRef.current.close(1000, "Component unmounted");
            }
        };
    }, [reconnectAttempts]);

    return { isConnected, reconnectAttempts, maxRetries };
};
