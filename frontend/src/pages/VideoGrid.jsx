import React, { useState, useEffect, useRef } from 'react';
import BottomNavbar from "../components/Route/BottomNavbar/BottomNavbar";
import { AiOutlineShoppingCart, AiOutlineShopping, AiOutlineHeart, AiOutlineComment } from 'react-icons/ai';

const videos = [
  '/videos/wewe1.mp4',
  '/videos/wewe2.mp4',
  '/videos/wewe3.mp4',
  '/videos/wewe4.mp4',
];

const VideoGrid = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false); // State for toggling description
  const videoContainerRef = useRef(null);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex + 1 < videos.length ? prevIndex + 1 : 0 // Loop back to the first video
    );
  };

  const handleAddToCart = () => {
    alert(`Video ${currentVideoIndex + 1} added to cart!`);
  };

  const handleBuyNow = () => {
    alert(`Buying Video ${currentVideoIndex + 1}`);
  };

  const handleLikeVideo = () => {
    alert(`You liked Video ${currentVideoIndex + 1}`);
  };

  const handleReviewVideo = () => {
    alert(`Reviewing Video ${currentVideoIndex + 1}`);
  };

  const handleScroll = (event) => {
    event.preventDefault(); // Prevent default scroll behavior

    if (event.deltaY > 0) {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex + 1 < videos.length ? prevIndex + 1 : 0 // Loop to first video if we reach end
      );
    } else {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex - 1 >= 0 ? prevIndex - 1 : videos.length - 1 // Loop to last video if we go before first
      );
    }
  };

  const handleToggleDescription = () => {
    setShowFullDescription((prev) => !prev); // Toggle the state for full description
  };

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      videoContainer.addEventListener('wheel', handleScroll, { passive: false });
      videoContainer.addEventListener('touchmove', handleScroll, { passive: false });
    }

    return () => {
      if (videoContainer) {
        videoContainer.removeEventListener('wheel', handleScroll);
        videoContainer.removeEventListener('touchmove', handleScroll);
      }
    };
  }, []);

  return (
    <>
      <BottomNavbar />
      <div
        ref={videoContainerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(130vh - 220px)',
          backgroundColor: '#000',
          color: '#fff',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '175%',
          backgroundColor: 'black',
          overflow: 'hidden',
        }}>
          <video
            key={currentVideoIndex}
            controls
            autoPlay
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              height: '100vh',
            }}
            onEnded={handleVideoEnd}
          >
            <source src={videos[currentVideoIndex]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Profile Picture and Name */}
        <div
          style={{
            position: 'absolute',
            left: '10px',
            top: '88%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
          }}
        >
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="Profile"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid #fff',
              marginRight: '10px',
            }}
          />
          <div>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Honesty Mode Wear</span>
            <br />
            <span
              onClick={handleToggleDescription}
              style={{
                fontSize: '14px',
                // fontWeight: 'bold',
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              {showFullDescription
                ? "Best wears for all categories | Available sizes: 6, 8 & 10. | Available colors:  Red, Blue, Yellow & Green" // Show full description when clicked
                : "Best wears for all categories.".slice(0, 25) + '...'}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          style={{
            position: 'absolute',
            top: '65%',
            right: '2px',
            transform: 'translateY(-50%)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            padding: '15px 10px',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        >
          <AiOutlineShoppingCart size={28} />
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          style={{
            position: 'absolute',
            top: '73%',
            right: '1px',
            transform: 'translateY(-50%)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            padding: '15px 10px',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        >
          <AiOutlineShopping size={28} />
        </button>

        {/* Like Button */}
        <button
          onClick={handleLikeVideo}
          style={{
            position: 'absolute',
            top: '82%',
            right: '2px',
            transform: 'translateY(-50%)',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            padding: '15px 10px',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        >
          <AiOutlineHeart size={28} />
        </button>

        <button
  onClick={() => alert(`You commented on Video ${currentVideoIndex + 1}`)}
  style={{
    position: 'absolute',
    top: '90%', // Adjusted to be below the Like Button
    right: '2px',
    transform: 'translateY(-50%)',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    padding: '15px 10px',
    borderRadius: '50%',
    cursor: 'pointer',
  }}
>
  <AiOutlineComment size={28} />
</button>
      </div>
    </>
  );
};

export default VideoGrid;


















// import React, { useState, useEffect, useRef } from 'react';
// import BottomNavbar from "../components/Route/BottomNavbar/BottomNavbar";
// import { AiOutlineShoppingCart, AiOutlineShopping, AiOutlineHeart } from 'react-icons/ai'; // Import the cart and buy icons

// const videos = [
//   '/videos/wewe1.mp4',
//   '/videos/wewe2.mp4',
//   '/videos/wewe3.mp4',
//   '/videos/wewe4.mp4',
// ];

// const VideoGrid = () => {
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const videoContainerRef = useRef(null);

//   const handleVideoEnd = () => {
//     setCurrentVideoIndex((prevIndex) =>
//       prevIndex + 1 < videos.length ? prevIndex + 1 : 0 // Loop back to the first video
//     );
//   };

//   const handleAddToCart = () => {
//     alert(`Video ${currentVideoIndex + 1} added to cart!`);
//   };

//   const handleBuyNow = () => {
//     alert(`Buying Video ${currentVideoIndex + 1}`);
//   };

//   const handleLikeVideo = () => {
//     alert(`You liked Video ${currentVideoIndex + 1}`);
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
//       <BottomNavbar />
//       <div
//         ref={videoContainerRef}
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           height: 'calc(130vh - 220px)', // Adjust for header and footer
//           backgroundColor: '#000',
//           color: '#fff',
//           overflow: 'hidden', // Prevent page scrolling
//           position: 'relative', // Make the container relative to position the button inside it
//         }}
//       >
//         <div style={{
//           position: 'relative',
//           width: '100%',
//           paddingBottom: '175%',
//           backgroundColor: 'black', 
//           overflow: 'hidden',
//         }}>
//         <video
//   key={currentVideoIndex}
//   controls
//   autoPlay
//   style={{
//     position: 'absolute',
//     top: 0,
//     left: '50%',
//     transform: 'translateX(-50%)',
//     width: '100%', // Adjust width as needed
//     height: '100vh', // Adjust height as needed, vh is a percentage of viewport height
//   }}
//   onEnded={handleVideoEnd}
// >
//   <source src={videos[currentVideoIndex]} type="video/mp4" />
//   Your browser does not support the video tag.
// </video>

//         </div>

//         {/* Profile Picture and Name */}
//         <div
//           style={{
//             position: 'absolute',
//             left: '10px',
//             top: '90%',
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
//             <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
//               Best wears for all categories.
//             </span>
//           </div>
//         </div>

//         {/* Add to Cart Button */}
//         <button
//           onClick={handleAddToCart}
//           style={{
//             position: 'absolute',
//             top: '70%',
//             right: '2px',
//             transform: 'translateY(-50%)',
//             border: 'none',
//             color: 'white',
//             fontSize: '24px',
//             padding: '15px 10px',
//             borderRadius: '50%',
//             cursor: 'pointer',
//           }}
//         >
//           <AiOutlineShoppingCart size={28} />
//         </button>

//         {/* Buy Now Button */}
//         <button
//           onClick={handleBuyNow}
//           style={{
//             position: 'absolute',
//             top: '78%',
//             right: '1px',
//             transform: 'translateY(-50%)',
//             border: 'none',
//             color: 'white',
//             fontSize: '24px',
//             padding: '15px 10px',
//             borderRadius: '50%',
//             cursor: 'pointer',
//           }}
//         >
//           <AiOutlineShopping size={28} />
//         </button>

//         {/* Like Button */}
//         <button
//           onClick={handleLikeVideo}
//           style={{
//             position: 'absolute',
//             top: '87%',
//             right: '2px',
//             transform: 'translateY(-50%)',
//             border: 'none',
//             color: 'white',
//             fontSize: '24px',
//             padding: '15px 10px',
//             borderRadius: '50%',
//             cursor: 'pointer',
//           }}
//         >
//           <AiOutlineHeart size={28} />
//         </button>
//       </div>
//     </>
//   );
// };

// export default VideoGrid;