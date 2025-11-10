import { createContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { messageService } from '../services/messageService';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', handleNewMessage);
      socket.on('messages_read', handleMessagesRead);

      return () => {
        socket.off('new_message', handleNewMessage);
        socket.off('messages_read', handleMessagesRead);
      };
    }
  }, [socket, activeConversation]);

  const fetchConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
      calculateUnreadCount(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data.messages);
      setActiveConversation(conversationId);
      
      // Mark as read
      await messageService.markAsRead(conversationId);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const message = await messageService.sendMessage(messageData);
      setMessages((prev) => [...prev, message]);
      
      // Update conversation list
      fetchConversations();
      
      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const handleNewMessage = (data) => {
    if (data.conversation === activeConversation) {
      setMessages((prev) => [...prev, data.message]);
      messageService.markAsRead(activeConversation);
    } else {
      setUnreadCount((prev) => prev + 1);
    }
    
    fetchConversations();
  };

  const handleMessagesRead = (data) => {
    if (data.conversationId === activeConversation) {
      setMessages((prev) =>
        prev.map((msg) => ({ ...msg, isRead: true }))
      );
    }
  };

  const calculateUnreadCount = (convos) => {
    const count = convos.reduce((total, conv) => {
      return total + (conv.unreadCount || 0);
    }, 0);
    setUnreadCount(count);
  };

  return (
    <MessageContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        unreadCount,
        fetchConversations,
        fetchMessages,
        sendMessage,
        setActiveConversation,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};