import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';
import { messageService } from '../../services/messageService';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const ChatWindow = ({ conversation, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  const otherUser = conversation.participants.find((p) => p._id !== user._id);

  useEffect(() => {
    fetchMessages();
    markAsRead();
  }, [conversation._id]);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', handleNewMessage);
      socket.on('user_typing', handleTyping);
      socket.on('user_stop_typing', handleStopTyping);

      return () => {
        socket.off('new_message', handleNewMessage);
        socket.off('user_typing', handleTyping);
        socket.off('user_stop_typing', handleStopTyping);
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await messageService.getMessages(conversation._id);
      setMessages(data.messages);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await messageService.markAsRead(conversation._id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleNewMessage = (data) => {
    if (data.conversation === conversation._id) {
      setMessages((prev) => [...prev, data.message]);
      markAsRead();
    }
  };

  const handleTyping = (data) => {
    if (data.conversationId === conversation._id) {
      setTyping(true);
    }
  };

  const handleStopTyping = (data) => {
    if (data.conversationId === conversation._id) {
      setTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const message = await messageService.sendMessage({
        conversationId: conversation._id,
        receiverId: otherUser._id,
        content: input,
      });

      setMessages((prev) => [...prev, message]);
      setInput('');
      socket?.emit('stop_typing', {
        receiverId: otherUser._id,
        conversationId: conversation._id,
      });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    if (!typing && e.target.value) {
      socket?.emit('typing', {
        receiverId: otherUser._id,
        conversationId: conversation._id,
      });
    }

    if (!e.target.value) {
      socket?.emit('stop_typing', {
        receiverId: otherUser._id,
        conversationId: conversation._id,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={otherUser.avatar || '/default-avatar.png'}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold">{otherUser.name}</h3>
            {typing && <p className="text-xs text-gray-500">typing...</p>}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
      </div>

      {/* Property Info (if available) */}
      {conversation.property && (
        <div className="p-3 bg-blue-50 border-b flex items-center gap-3">
          <img
            src={conversation.property.images[0]}
            alt={conversation.property.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{conversation.property.title}</p>
            <p className="text-xs text-gray-600">${conversation.property.price.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender._id === user._id;
          return (
            <div
              key={message._id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    isOwn
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <button className="text-gray-500 hover:text-primary-600">
            <FaImage size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaPaperPlane size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;