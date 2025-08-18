import { useState } from 'react';
import { Star, Send, MessageCircle, Heart, ThumbsUp, Award } from 'lucide-react';
import Navbar from '../Components/Navbar.jsx';

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      email,
      category,
      rating,
      feedback
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const categories = [
    { value: 'general', label: 'General Experience', icon: MessageCircle },
    { value: 'product', label: 'Product Quality', icon: Award },
    { value: 'service', label: 'Customer Service', icon: Heart },
    { value: 'suggestion', label: 'Suggestions', icon: ThumbsUp }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      text: "Amazing platform! Found exactly what I needed for my engineering course at a great price.",
      course: "B.Tech CSE"
    },
    {
      name: "Rahul Kumar",
      rating: 5,
      text: "Safe and reliable trading. The community here is really helpful and trustworthy.",
      course: "MBA"
    },
    {
      name: "Anita Patel",
      rating: 4,
      text: "Great variety of books and instruments. Saved a lot of money on my medical textbooks!",
      course: "B.Tech ECE"
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FFF4DC] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#333333] mb-2">Thank You!</h2>
          <p className="text-gray-600">Your feedback has been submitted successfully. We appreciate your input!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-[#FFF4DC]">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#F47C26] to-orange-600 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              We Value Your Feedback
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Help us improve our platform and create a better experience for the student community
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Feedback Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#333333] mb-2">Share Your Experience</h2>
                  <div className="w-16 h-1 bg-[#F47C26] rounded-full"></div>
                </div>

                <div className="space-y-6">
                  
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#333333] font-semibold mb-2">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F47C26] focus:border-transparent transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-[#333333] font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F47C26] focus:border-transparent transition-all"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-[#333333] font-semibold mb-4">Feedback Category</label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                            category === cat.value
                              ? 'border-[#F47C26] bg-orange-50 text-[#F47C26]'
                              : 'border-gray-200 hover:border-[#F47C26] hover:bg-orange-50'
                          }`}
                        >
                          <cat.icon className="h-5 w-5" />
                          <span className="font-medium text-sm">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-[#333333] font-semibold mb-4">
                      Rate Your Experience
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= (hoveredRating || rating)
                                ? 'fill-[#F47C26] text-[#F47C26]'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-4 text-[#333333] font-semibold">
                          {rating === 1 && "Poor"}
                          {rating === 2 && "Fair"}
                          {rating === 3 && "Good"}
                          {rating === 4 && "Very Good"}
                          {rating === 5 && "Excellent"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div>
                    <label className="block text-[#333333] font-semibold mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F47C26] focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your experience, suggestions for improvement, or any issues you've encountered..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#F47C26] text-white py-4 px-8 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Submit Feedback
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#333333] mb-4">Get in Touch</h3>
                <div className="space-y-3 text-gray-600">
                  <p>📧 feedback@yourplatform.com</p>
                  <p>📞 +91 98765 43210</p>
                  <p>🕒 Mon-Fri: 9AM-6PM</p>
                </div>
              </div>

              {/* Recent Testimonials */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#333333] mb-6">What Students Say</h3>
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-[#F47C26] pl-4">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-[#F47C26] text-[#F47C26]" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">"{testimonial.text}"</p>
                      <div className="text-xs text-[#F47C26] font-semibold">
                        - {testimonial.name}, {testimonial.course}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-[#F47C26] to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Community Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Happy Students</span>
                    <span className="font-bold">2,500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Rating</span>
                    <span className="font-bold">4.8/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span className="font-bold">&lt; 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;