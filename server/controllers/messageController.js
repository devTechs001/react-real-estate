import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import { io } from '../server.js';

// @desc    Get conversations
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      status: 'active',
    })
      .populate('participants', 'name email avatar')
      .populate('property', 'title images price')
      .populate('lastMessage')
      .sort('-updatedAt');

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages in conversation
// @route   GET /api/messages/:conversationId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .populate('property', 'title images price')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Message.countDocuments({ conversation: conversationId });

    res.json({
      messages: messages.reverse(),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, content, messageType, propertyId } = req.body;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    } else {
      // Create new conversation
      conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, receiverId] },
        property: propertyId,
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, receiverId],
          property: propertyId,
          unreadCount: {
            [receiverId]: 0,
          },
        });
      }
    }

    // Create message
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType: messageType || 'text',
      property: propertyId,
    });

    // Update conversation
    conversation.lastMessage = message._id;
    const currentCount = conversation.unreadCount.get(receiverId) || 0;
    conversation.unreadCount.set(receiverId, currentCount + 1);
    await conversation.save();

    // Populate message
    await message.populate('sender', 'name avatar');
    if (propertyId) {
      await message.populate('property', 'title images price');
    }

    // Emit socket event
    io.to(receiverId).emit('new_message', {
      message,
      conversation: conversation._id,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/:conversationId/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    // Reset unread count
    const conversation = await Conversation.findById(conversationId);
    conversation.unreadCount.set(req.user._id.toString(), 0);
    await conversation.save();

    // Emit socket event
    const otherParticipant = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );
    io.to(otherParticipant.toString()).emit('messages_read', {
      conversationId,
      userId: req.user._id,
    });

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete conversation
// @route   DELETE /api/messages/:conversationId
// @access  Private
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Message.deleteMany({ conversation: conversationId });
    await conversation.deleteOne();

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};