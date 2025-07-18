import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Correct CSS import
import "./VideoPlayer.css";
import { useTranslation } from 'react-i18next';


const videos = [
  { src: "/videos/wewe1.mp4" },
  { src: "/videos/wewe2.mp4" },
  { src: "/videos/wewe2.mp4" },
  { src: "/videos/wewe2.mp4" },
];




const SmallVideo = () => {
  const { t, i18n } = useTranslation('en');


  const [language, setLanguage] = useState(i18n.language); // Get initial language

  const handleLanguageChange = (lang) => {


    i18n.changeLanguage(lang ? 'ar' : 'en'); // Set language based on checkbox state

    setLanguage(lang ? 'ar' : 'en');
  };


  useEffect(() => {
    document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);
  return (
    <>
         <h1  style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          textAlign: "left",
          margin: "1rem 0",
          paddingLeft: "1rem",
        }}>{t("bestdeal")}</h1>
    <Swiper
      spaceBetween={10} // Reduced space between slides
      slidesPerView={3} // Number of visible slides
      grabCursor={true}
      loop={true}
    >

      {videos.map((video, index) => (
        <SwiperSlide key={index}>
          <div className="video-card">
            <video
              src={video.src}
              controls
              autoPlay
              loop
              muted
              className="video"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>


    <h1 style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          textAlign: "left",
          margin: "1rem 0",
          paddingLeft: "1rem",
        }}>{t("popular")}</h1>
    <Swiper
      spaceBetween={10} // Reduced space between slides
      slidesPerView={3} // Number of visible slides
      grabCursor={true}
      loop={true}
    >

      {videos.map((video, index) => (
        <SwiperSlide key={index}>
          <div className="video-card">
            <video
              src={video.src}
              controls
              autoPlay
              loop
              muted
              className="video"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>



    <h1 style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          textAlign: "left",
          margin: "1rem 0",
          paddingLeft: "1rem",
        }}>{t("featured")}</h1>
    <Swiper
      spaceBetween={10} // Reduced space between slides
      slidesPerView={3} // Number of visible slides
      grabCursor={true}
      loop={true}
    >

      {videos.map((video, index) => (
        <SwiperSlide key={index}>
          <div className="video-card">
            <video
              src={video.src}
              controls
              autoPlay
              loop
              muted
              className="video"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    </>
  );
};

export default SmallVideo;












// import React, { useState, useEffect, useRef } from 'react';
// import BottomNavbar from "../components/Route/BottomNavbar/BottomNavbar";
// import { AiOutlineShoppingCart, AiOutlineShopping, AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';

// const videos = [
//   '/videos/wewe1.mp4',
//   '/videos/wewe2.mp4',
//   '/videos/wewe3.mp4',
//   '/videos/wewe4.mp4',
// ];

// const SmallVideo = () => {
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [showFullDescription, setShowFullDescription] = useState(false); // State for toggling description
//   const videoContainerRef = useRef(null);

//   const handleVideoEnd = () => {
//     setCurrentVideoIndex((prevIndex) =>
//       prevIndex + 1 < videos.length ? prevIndex + 1 : 0 // Loop back to the first video
//     );
//   };


//   const handleScroll = (event) => {
//     event.preventDefault(); // Prevent default scroll behavior

//     if (event.deltaY > 0) {
//       setCurrentVideoIndex((prevIndex) =>
//         prevIndex + 1 < videos.length ? prevIndex + 1 : 0 // Loop to first video if we reach end
//       );
//     } else {
//       setCurrentVideoIndex((prevIndex) =>
//         prevIndex - 1 >= 0 ? prevIndex - 1 : videos.length - 1 // Loop to last video if we go before first
//       );
//     }
//   };

//   const handleToggleDescription = () => {
//     setShowFullDescription((prev) => !prev); // Toggle the state for full description
//   };

//   useEffect(() => {
//     const videoContainer = videoContainerRef.current;
//     if (videoContainer) {
//       videoContainer.addEventListener('wheel', handleScroll, { passive: false });
//       videoContainer.addEventListener('touchmove', handleScroll, { passive: false });
//     }

//     return () => {
//       if (videoContainer) {
//         videoContainer.removeEventListener('wheel', handleScroll);
//         videoContainer.removeEventListener('touchmove', handleScroll);
//       }
//     };
//   }, []);

//   return (
//     <>
//       <div
//         ref={videoContainerRef}
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           height: 'calc(130vh - 220px)',
//           backgroundColor: '#000',
//           color: '#fff',
//           overflow: 'hidden',
//           position: 'relative',
//         }}
//       >
//         <div style={{
//           position: 'relative',
//           width: '100%',
//           paddingBottom: '175%',
//           backgroundColor: 'black',
//           overflow: 'hidden',
//         }}>
//           <video
//             key={currentVideoIndex}
//             controls
//             autoPlay
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: '50%',
//               transform: 'translateX(-50%)',
//               width: '100%',
//               height: '100vh',
//             }}
//             onEnded={handleVideoEnd}
//           >
//             <source src={videos[currentVideoIndex]} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>

//         {/* Profile Picture and Name */}
//         <div
//           style={{
//             position: 'absolute',
//             left: '10px',
//             top: '88%',
//             transform: 'translateY(-50%)',
//             display: 'flex',
//             alignItems: 'center',
//             color: '#fff',
//           }}
//         >
//           <img
//             src="https://randomuser.me/api/portraits/men/75.jpg"
//             alt="Profile"
//             style={{
//               width: '40px',
//               height: '40px',
//               borderRadius: '50%',
//               border: '2px solid #fff',
//               marginRight: '10px',
//             }}
//           />
//           <div>
//             <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Honesty Mode Wear</span>
//             <br />
//             <span
//               onClick={handleToggleDescription}
//               style={{
//                 fontSize: '14px',
//                 // fontWeight: 'bold',
//                 cursor: 'pointer',
//                 color: '#fff',
//               }}
//             >
//               {showFullDescription
//                 ? "Best wears for all categories | Available sizes: 6, 8 & 10. | Available colors:  Red, Blue, Yellow & Green" // Show full description when clicked
//                 : "Best wears for all categories.".slice(0, 25) + '...'}
//             </span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SmallVideo;