import express from 'express';
import {
  createSavedSearch,
  getSavedSearches,
  updateSavedSearch,
  deleteSavedSearch,
  getMatchingProperties,
} from '../controllers/savedSearchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getSavedSearches).post(createSavedSearch);

router
  .route('/:id')
  .put(updateSavedSearch)
  .delete(deleteSavedSearch);

router.get('/:id/matches', getMatchingProperties);

export default router;