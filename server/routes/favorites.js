import express from 'express';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  updateFavorite,
  checkFavorite,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.get('/check/:propertyId', checkFavorite);
router.put('/:id', updateFavorite);
router.delete('/:propertyId', removeFavorite);

export default router;