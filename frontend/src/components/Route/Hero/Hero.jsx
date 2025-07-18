import React, { useState, useEffect } from "react";

// Import local images
import image1 from "../Banners/image1.jpg";
import image2 from "../Banners/image2.jpg";
import image3 from "../Banners/image3.jpg";

const Hero = () => {
  const slides = [
    {
      id: 1,
      image: image1,
    },
    {
      id: 2,
      image: image2,
    },
    {
      id: 3,
      image: image3,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Automatically transition slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // 3000 ms = 3 seconds
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "345px",
        margin: "10px auto", // Added top and bottom margins
        borderRadius: "5px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Slides */}
      <div
        style={{
          display: "flex",
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            style={{
              minWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <img
              src={slide.image}
              alt={slide.caption}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#333",
              }}
            >
              {slide.caption}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ›
      </button>

      {/* Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px",
        }}
      >
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: "8px",
              height: "8px",
              background: currentSlide === index ? "#333" : "#ccc",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
