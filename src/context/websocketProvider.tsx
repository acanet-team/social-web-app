import { useSession } from "next-auth/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

interface WebSocketContextType {
  notifications: any[];
  socket: ReconnectingWebSocket | null;
  emitEvent: (event: string, data: any) => void;
}

interface Notification {
  id: string;
  // Add other properties of the notification object
}
const WebSocketContext = createContext<WebSocketContextType>({
  notifications: [],
  socket: null,
  emitEvent: () => {},
});

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession() as any;
  const [socket, setSocket] = useState<ReconnectingWebSocket | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: any) => {
    // console.log("Attempting to add notification:", message);
    setNotifications((prevState) => {
      // Only add the notification if it doesn't already exist (by ID).
      const exists = prevState.some(
        (notification) => notification.id === message.id,
      );
      if (!exists) {
        return [message, ...prevState];
      }
      return prevState;
    });
  }, []);

  useEffect(() => {
    const newSocket = new ReconnectingWebSocket(
      "wss://kdc8tpgrc4.execute-api.ap-southeast-1.amazonaws.com/develop/",
    );

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const message = JSON.parse(data.message);
      addNotification(message);
    };

    // Subscribe channel
    newSocket.addEventListener("open", () => {
      if (session) {
        newSocket.send(
          JSON.stringify({
            action: "setChannel",
            userId: `notification:${session.user?.id}`,
          }),
        );
      }
    });

    // Listen to message
    newSocket.addEventListener("message", handleMessage);

    // newSocket.addEventListener("close", () => {
    //   console.log("WebSocket disconnected");
    // });

    newSocket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [session, addNotification]);

  const emitEvent = useCallback(
    (event: string, data: any) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ event, data }));
      } else {
        console.error("WebSocket is not open");
      }
    },
    [socket],
  );

  return (
    <WebSocketContext.Provider value={{ notifications, socket, emitEvent }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
