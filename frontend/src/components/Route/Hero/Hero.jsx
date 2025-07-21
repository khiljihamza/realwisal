import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import local images
import image1 from "../Banners/image1.jpg";
import image2 from "../Banners/image2.jpg";
import image3 from "../Banners/image3.jpg";

const Hero = () => {
  const slides = [
    {
      id: 1,
      image: image1,
      title: "Summer Collection 2025",
      subtitle: "Discover the latest trends and styles",
      cta: "Shop Now",
      link: "/products"
    },
    {
      id: 2,
      image: image2,
      title: "Exclusive Deals",
      subtitle: "Up to 70% off on selected items",
      cta: "View Offers",
      link: "/best-selling"
    },
    {
      id: 3,
      image: image3,
      title: "New Arrivals",
      subtitle: "Be the first to shop our newest products",
      cta: "Explore",
      link: "/events"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Automatically transition slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-full mx-auto overflow-hidden bg-neutral-50 dark:bg-neutral-900">
      {/* Main Hero Banner */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 md:px-12 lg:px-24">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-white/90 text-sm md:text-lg lg:text-xl mb-4 md:mb-6 max-w-md"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <a
                    href={slides[currentSlide].link}
                    className="inline-block bg-brand-primary-500 hover:bg-brand-primary-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    {slides[currentSlide].cta}
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-none rounded-full w-10 h-10 md:w-12 md:h-12 cursor-pointer flex items-center justify-center z-10 transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-none rounded-full w-10 h-10 md:w-12 md:h-12 cursor-pointer flex items-center justify-center z-10 transition-all duration-300"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? "bg-white scale-110" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
