import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlineUser,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useTranslation } from 'react-i18next';


// W icon as a custom SVG component with decreased size
const WIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: "45px", height: "45px", marginTop: "-10px" }} // Adjust margin-top to reduce gap
  >
    <path d="M2 6l3 8 3-8 3 8 3-8" />
  </svg>
);


const BottomNavbar = () => {
  const { cart } = useSelector((state) => state.cart); // Access cart state
  const totalQuantity = cart.reduce((acc, item) => acc + item.qty, 0); // Calculate total items in cart

    const { t, i18n } = useTranslation('en');
  
     const [language, setLanguage] = useState(i18n.language); // Get initial language
    
      const handleLanguageChange = (lang) => {
    
    
        i18n.changeLanguage(lang ? 'ar' : 'en'); // Set language based on checkbox state
    
        setLanguage(lang ? 'ar' : 'en');
      };
    
    
      useEffect(() => {
        document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
      }, [i18n.language]);

  const navbarStyle = {
    position: "fixed",
    bottom: -1,
    width: "100%",
    height: "58px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)",
    zIndex: 100,
  };

  const navItemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "12px",
    color: "#333",
    cursor: "pointer",
    position: "relative", // Needed for badge positioning
  };

  const iconStyle = {
    fontSize: "20px", // Reduced size for the icon
  };

  const textStyle = {
    marginTop: "2px",
    fontSize: "10px",
    fontWeight: "bold",
  };

  const badgeStyle = {
    position: "absolute",
    top: "-5px",
    right: "-10px",
    backgroundColor: "red",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "bold",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={navbarStyle}>
      <Link to="/">
        <div style={navItemStyle}>
          <AiOutlineHome style={iconStyle} />
          <p style={textStyle}>{t("home")}</p>
        </div>
      </Link>

      <Link to="/categories">
        <div style={navItemStyle}>
          <AiOutlineAppstore style={iconStyle} />
          <p style={textStyle}>{t("category")}</p>
        </div>
      </Link>

      <Link to="/VideoGrid">
        <div style={navItemStyle}>
          <WIcon /> {/* Custom W icon with smaller size */}
          {/* Optional: Remove or keep text */}
        </div>
      </Link>

      <Link to="/Account">
        <div style={navItemStyle}>
          <AiOutlineUser style={iconStyle} />
          <p style={textStyle}>{t("account")}</p>
        </div>
      </Link>

      <Link to="/Cart">
        <div style={navItemStyle}>
          <AiOutlineShoppingCart style={iconStyle} />
          {totalQuantity > 0 && (
            <span style={badgeStyle}>{totalQuantity}</span>
          )}
          <p style={textStyle}>{t("cart")}</p>
        </div>
      </Link>
    </div>
  );
};

export default BottomNavbar;
















// import React from 'react';
// import { Link } from "react-router-dom";
// import {
//     AiOutlineHome,
//     AiOutlineAppstore,
//     AiOutlineUser,
//     AiOutlineShoppingCart,
// } from "react-icons/ai";

// // W icon as a custom SVG component with decreased size
// const WIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 16 16"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     style={{ fontSize: '16px' }}
//   >
//     <path d="M2 6l3 8 3-8 3 8 3-8" />
//   </svg>
// );

// const BottomNavbar = () => {
//   const navbarStyle = {
//     position: 'fixed',
//     bottom: -1,
//     width: '100%',
//     height: '58px',
//     display: 'flex',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)',
//     zIndex: 100,
//   };

//   const navItemStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     fontSize: '12px',
//     color: '#333',
//     cursor: 'pointer',
//   };

//   const iconStyle = {
//     fontSize: '20px',  // Reduced size for the icon
//   };

//   const textStyle = {
//     marginTop: '2px',
//     fontSize: '10px',
//     fontWeight: 'bold',
//   };

//   return (
//     <div style={navbarStyle}>
//       <Link to="/">
//         <div style={navItemStyle}>
//           <AiOutlineHome style={iconStyle} />
//           <p style={textStyle}>Home</p>
//         </div>
//       </Link>

//       <Link to="/categories">
//         <div style={navItemStyle}>
//           <AiOutlineAppstore style={iconStyle} />
//           <p style={textStyle}>Category</p>
//         </div>
//       </Link>

//       <Link to="/VideoGrid">
//         <div style={navItemStyle}>
//           <WIcon /> {/* Custom W icon with smaller size */}
//           <p style={textStyle}>Explore</p>
//         </div>
//       </Link>

//       <div style={navItemStyle}>
//         <AiOutlineUser style={iconStyle} />
//         <p style={textStyle}>Account</p>
//       </div>

//       <Link to="/Cart">
//       <div style={navItemStyle}>
//         <AiOutlineShoppingCart style={iconStyle} />
//         <p style={textStyle}>Cart</p>
//       </div>
//       </Link>

//     </div>
//   );
// };

// export default BottomNavbar;