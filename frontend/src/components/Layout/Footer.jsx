import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPinterestP,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaGooglePay
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import WISALlogo from '../images/WISALlogo.png';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-brand-primary-700 to-brand-primary-500 py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Stay Updated</h2>
              <p className="text-white/80 text-base md:text-lg">
                Subscribe to our newsletter for exclusive deals, new arrivals, and more.
              </p>
            </div>
            <div className="md:w-1/2">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="flex-grow px-4 py-3 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-primary-300"
                />
                <button 
                  type="submit"
                  className="bg-white text-brand-primary-600 hover:bg-neutral-100 px-6 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img 
                src={WISALlogo} 
                alt="Wisal" 
                className="h-10 w-auto" 
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <p className="text-neutral-400 mb-6">
              Your premier destination for quality products and exceptional shopping experiences.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-neutral-400 hover:text-brand-primary-400 transition-colors">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-brand-primary-400 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-brand-primary-400 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-brand-primary-400 transition-colors">
                <FaYoutube size={18} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-brand-primary-400 transition-colors">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Shop</h3>
            <ul className="space-y-3">
              {footerProductLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-neutral-400 hover:text-white transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {footercompanyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-neutral-400 hover:text-white transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-brand-primary-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-neutral-400">
                  123 Commerce Street, Business District, City, Country
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-brand-primary-500 mr-3 flex-shrink-0" />
                <span className="text-neutral-400">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-brand-primary-500 mr-3 flex-shrink-0" />
                <span className="text-neutral-400">support@wisal.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-neutral-500 text-sm">
                © 2024 Wisal. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
              <Link to="/terms" className="text-neutral-500 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-neutral-500 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/shipping" className="text-neutral-500 hover:text-white text-sm">
                Shipping Policy
              </Link>
              <Link to="/refund" className="text-neutral-500 hover:text-white text-sm">
                Refund Policy
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <FaCreditCard className="text-neutral-400" size={24} />
              <FaPaypal className="text-neutral-400" size={24} />
              <FaApplePay className="text-neutral-400" size={24} />
              <FaGooglePay className="text-neutral-400" size={24} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
