import { useState, useEffect } from 'react';
import { FaStar, FaReply, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Loader from '../../components/common/Loader';
import SEO from '../../components/common/SEO';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {},
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/seller/reviews');
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;

    try {
      const { data } = await api.post(`/seller/reviews/${reviewId}/reply`, {
        reply: replyText,
      });
      setReviews(
        reviews.map((r) => (r._id === reviewId ? { ...r, reply: data.reply } : r))
      );
      setReplyingTo(null);
      setReplyText('');
      toast.success('Reply posted');
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (loading) return <Loader fullScreen />;

  return (
    <>
      <SEO title="Reviews" description="Customer reviews and ratings" />

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">
            <FaStar className="inline mr-3" />
            Reviews & Ratings
          </h1>
          <p className="text-xl">See what customers are saying about your properties</p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 mb-2">Average Rating</p>
            <p className="text-5xl font-bold text-yellow-500 mb-2">
              {stats.averageRating.toFixed(1)}
            </p>
            <div className="flex justify-center gap-1">
              {renderStars(Math.round(stats.averageRating))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-gray-600 mb-2">Total Reviews</p>
            <p className="text-5xl font-bold text-primary-600">{stats.totalReviews}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-600 mb-4">Rating Distribution</p>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2 mb-2">
                <span className="text-sm w-8">{rating} ★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${
                        ((stats.ratingDistribution[rating] || 0) / stats.totalReviews) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm w-8 text-right">
                  {stats.ratingDistribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-12 text-center"
          >
            <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-gray-600">
              Reviews from customers will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.user.name}</p>
                        <p className="text-sm text-gray-600">{review.property.title}</p>
                      </div>
                      <div className="flex gap-1">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>

                    {/* Reply Section */}
                    {review.reply ? (
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold mb-1">Your Reply:</p>
                        <p className="text-sm text-gray-700">{review.reply}</p>
                      </div>
                    ) : replyingTo === review._id ? (
                      <div className="mt-4">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                          rows="3"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleReply(review._id)}
                            className="btn btn-success btn-sm"
                          >
                            Post Reply
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="btn btn-outline btn-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(review._id)}
                        className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        <FaReply className="inline mr-2" />
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
