import { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../hooks/useAuth';
import ReviewForm from '../forms/ReviewForm';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const PropertyReviews = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: {},
  });
  const [showForm, setShowForm] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getPropertyReviews(propertyId);
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleSubmit = async (reviewData) => {
    try {
      await reviewService.createReview({ ...reviewData, property: propertyId });
      toast.success('Review submitted successfully!');
      setShowForm(false);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
        {isAuthenticated && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <ReviewForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {stats.average.toFixed(1)}
            </div>
            <div className="flex justify-center my-2">{renderStars(Math.round(stats.average))}</div>
            <div className="text-sm text-gray-600">{stats.total} reviews</div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3 mb-2">
                  <span className="text-sm w-8">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start gap-4">
              <img
                src={review.user.avatar || '/default-avatar.png'}
                alt={review.user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.user.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No reviews yet. Be the first to review this property!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyReviews;