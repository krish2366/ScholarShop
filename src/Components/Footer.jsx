import { Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-[#F47C26] text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">ScholarShop</h3>
            <p className="text-orange-100 mb-4 leading-relaxed">
              The ultimate C2C marketplace for MAIT students. Buy, sell, and connect with fellow students in a safe and trusted environment.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-orange-100 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#products" className="text-orange-100 hover:text-white transition-colors">Browse Products</a>
              </li>
              <li>
                <a href="/post" className="text-orange-100 hover:text-white transition-colors">Sell Your Item</a>
              </li>
              <li>
                <a href="/profile" className="text-orange-100 hover:text-white transition-colors">My Account</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/category/Electronics" className="text-orange-100 hover:text-white transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/category/Books" className="text-orange-100 hover:text-white transition-colors">Books</Link>
              </li>
              <li>
                <Link to="/category/PYQs" className="text-orange-100 hover:text-white transition-colors">PYQs</Link>
              </li>
              <li>
                <Link to="/category/Instruments" className="text-orange-100 hover:text-white transition-colors">Instruments</Link>
              </li>
              <li>
                <Link to="/category/Essentials" className="text-orange-100 hover:text-white transition-colors">Essentials</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact & Support</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-200" />
                <span className="text-orange-100">aryan12.mishra2321@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-200" />
                <span className="text-orange-100">+91 88529 91223</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-orange-200 mt-1" />
                <span className="text-orange-100">
                  MAIT,Block 11
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-orange-100 text-sm">
                © 2025 ScholarShop. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-orange-100">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-100" />
                <span>for students</span>
              </div>
              
              <button
                onClick={scrollToTop}
                className="bg-orange-500 hover:bg-orange-400 text-white p-2 rounded-full transition-colors"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;