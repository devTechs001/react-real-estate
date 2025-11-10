import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-3xl transition-colors"
            >
              {star <= (hoverRating || rating) ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-gray-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Your Review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this property..."
        rows={4}
        required
      />

      <div className="flex gap-3">
        <Button type="submit" loading={loading} disabled={rating === 0}>
          Submit Review
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;