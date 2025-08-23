import { useState, useEffect } from 'react';
import { Star, Send, MessageCircle, Heart, ThumbsUp, Award, CheckCircle } from 'lucide-react';
import Navbar from '../Components/Navbar.jsx';

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publicTestimonials, setPublicTestimonials] = useState([]);

  const categories = [
    { value: 'general', label: 'General Experience', icon: MessageCircle },
    { value: 'product', label: 'Product Quality', icon: Award },
    { value: 'service', label: 'Customer Service', icon: Heart },
    { value: 'suggestion', label: 'Suggestions', icon: ThumbsUp }
  ];

  // Fetch public testimonials on component mount
  useEffect(() => {
    fetchPublicTestimonials();
  }, []);

  const fetchPublicTestimonials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/feedback/public?limit=6&featured=true`);
      const data = await response.json();
      
      if (data.success && data.feedbacks.length > 0) {
        setPublicTestimonials(data.feedbacks);
      } else {
        // Fallback to static testimonials if no public ones available
        setPublicTestimonials([
          { id: 1, name: "Priya Sharma", rating: 5, feedback: "Amazing platform! Found exactly what I needed for my engineering course at a great price.", category: "general" },
          { id: 2, name: "Rahul Kumar", rating: 5, feedback: "Safe and reliable trading. The community here is really helpful and trustworthy.", category: "general" },
          { id: 3, name: "Anita Patel", rating: 4, feedback: "Great variety of books and instruments. Saved a lot of money on my medical textbooks!", category: "product" }
        ]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Keep static testimonials as fallback
      setPublicTestimonials([
        { id: 1, name: "Priya Sharma", rating: 5, feedback: "Amazing platform! Found exactly what I needed for my engineering course at a great price.", category: "general" },
        { id: 2, name: "Rahul Kumar", rating: 5, feedback: "Safe and reliable trading. The community here is really helpful and trustworthy.", category: "general" },
        { id: 3, name: "Anita Patel", rating: 4, feedback: "Great variety of books and instruments. Saved a lot of money on my medical textbooks!", category: "product" }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name.trim() || !email.trim() || !feedback.trim() || rating === 0) {
      setError('Please fill in all required fields and provide a rating.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_MAIN_BACKEND_URL}/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          rating,
          category,
          feedback: feedback.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        // Reset form
        setName('');
        setEmail('');
        setRating(0);
        setFeedback('');
        setCategory('general');
        
        // Refresh testimonials to potentially show the new one if auto-approved
        setTimeout(() => {
          fetchPublicTestimonials();
          setSubmitted(false);
        }, 5000);
      } else {
        setError(data.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12">
            <div className="mb-8">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
              <p className="text-xl text-gray-600 mb-6">
                Your feedback has been submitted successfully. We appreciate your input!
              </p>
              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
                <p className="text-orange-800 font-semibold">
                  Help us improve our platform and create a better experience for the student community
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl mb-2">📧</span>
                <span className="font-medium">feedback@scholarshop.shop</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl mb-2">📞</span>
                <span className="font-medium">+91 98765 43210</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl mb-2">🕒</span>
                <span className="font-medium">Mon-Fri: 9AM-6PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Share Your Feedback</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your thoughts matter! Help us improve ScholarShop by sharing your experience with our platform.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Feedback Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tell Us What You Think</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Feedback Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCategory(value)}
                      className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                        category === value
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-3 text-sm font-medium text-gray-600">
                      {rating === 5 ? 'Excellent!' : 
                       rating === 4 ? 'Very Good!' : 
                       rating === 3 ? 'Good!' : 
                       rating === 2 ? 'Fair' : 'Poor'}
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Share your thoughts, suggestions, or experience..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {feedback.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>

          {/* Testimonials Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What Our Users Say</h2>
              <div className="space-y-6">
                {publicTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="p-6 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        {testimonial.name}
                      </span>
                      <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full capitalize">
                        {testimonial.category}
                      </span>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
