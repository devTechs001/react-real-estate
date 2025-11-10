import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  deleteConversation,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:conversationId', getMessages);
router.post('/', sendMessage);
router.put('/:conversationId/read', markAsRead);
router.delete('/:conversationId', deleteConversation);

export default router;