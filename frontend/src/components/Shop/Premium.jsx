import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import BottomNavbar from "../Route/BottomNavbar/BottomNavbar";
import Header from "../Layout/Header";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { Link } from "react-router-dom";
import "./PricingApp.css";

const RegisterrPage = () => {
  const [selectMonthly, setSelectMonthly] = useState(true);
  const navigate = useNavigate(); // Initialize navigate
  console.log(selectMonthly);

  const { t, i18n } = useTranslation('en');
  
  
    const [language, setLanguage] = useState(i18n.language); // Get initial language
  
    const handleLanguageChange = (lang) => {
  
  
      i18n.changeLanguage(lang ? 'ar' : 'en'); // Set language based on checkbox state
  
      setLanguage(lang ? 'ar' : 'en');
    };
  
  
    useEffect(() => {
      document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
    }, [i18n.language]);

  // PricingCard component inside App
  const PricingCard = ({ title, price, storage, users, sendUp }) => {
    const handleSubmit = () => {
      // Navigate to the home page when Submit is clicked
      navigate("/"); // Replace with your desired route if different
    };
    return (

     
      <div className="PricingCard">
        <header>
          <p className="card-title">{t(title)}</p>
          <h1 className="card-price">{price}</h1>
        </header>
        {/* features here */}
        <div className="card-features">
          <div className="card-storage">{t(storage)}</div>
          <div className="card-users-allowed">{users} {t("users in total")}</div>
          <div className="card-send-up">{t("Duration")} {sendUp}</div>
        </div>
         {/* Radio Button to select the plan */}
         <div className="card-select">
          <input
            type="radio"
            name="plan"
          />
          <label >{t("Select")}</label>
        </div>
        <button className="card-btn" onClick={handleSubmit}>{t("Submit")}</button>

      </div>
    );
  };

  return (
    <>
    <Header />
    <BottomNavbar />
    <div className="PricingApp">
      <div className="app-container">
        {/* Header */}
        <header>
          <h1 className="header-topic">{t("Select Subscription")}</h1>
          <div className="header-row">
            <p>{t("1-Month")}</p>
            <label className="price-switch">
              <input
                className="price-checkbox"
                onChange={() => {
                  setSelectMonthly((prev) => !prev);
                }}
                type="checkbox"
              />
              <div className="switch-slider"></div>
            </label>
            <p>{t("6-Month")}</p>
          </div>
        </header>
        {/* Cards here */}
        <div className="pricing-cards">
          <PricingCard
            title="Standard Membership"
            price={selectMonthly ? "₹₹₹" : "₹₹₹"}
            storage="Gain access to WISAL's platform with basic selling features and customer support."
            users="5"
            sendUp="1"
          />
          <PricingCard
            title="Deluxe"
            price={selectMonthly ? "₹₹₹" : "₹₹₹"}
            storage="Unlock enhanced selling features, commission discounts, and exclusive logistics perks Unlock enhanced selling features, commission discounts, and exclusive logistics perks."
            users="10"
            sendUp="3"
          />
          <PricingCard
            title="Premium Membership"
            price={selectMonthly ? "₹₹₹" : "₹₹₹"}
            storage="Unlock enhanced selling features, commission discounts, and exclusive logistics perks."
            users="20"
            sendUp="6"

          />
        </div>
      </div>
    </div>
    </>
  );
};

export default RegisterrPage;




















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import BottomNavbar from "../Route/BottomNavbar/BottomNavbar";
// import Header from "../Layout/Header";
// import { Link } from "react-router-dom";

// import "./RegisterrPage.css"; // Importing CSS file

// const RegisterrPage = () => {
//   const navigate = useNavigate(); // Hook to get navigate function
//   const [selectedMembership, setSelectedMembership] = useState(null); // State for selected membership

//   const handleNavigate = () => {
//     if (selectedMembership) {
//       console.log("Selected Membership:", selectedMembership);
//       navigate("/shop-create"); // Programmatically navigate to /shop-register
//     } else {
//       alert("Please select a membership option.");
//     }
//   };

//   const categories = [
//     {
//       id: 1,
//       title: "Standard Membership",
//       description:
//         " Gain access to WISAL's platform with basic selling features and customer support.",
//       months: "1-month",
//     },
//     {
//       id: 2,
//       title: "Premium Membership",
//       description:
//         "Unlock enhanced selling features, commission discounts, and exclusive logistics perks.",
//       months: "3-month",
//     },
//     {
//       id: 3,
//       title: "Standard Membership",
//       description:
//         " Gain access to WISAL's platform with basic selling features and customer support.",
//       months: "3-month",
//     },
//     {
//       id: 4,
//       title: "Premium Membership",
//       description:
//         "Unlock enhanced selling features, commission discounts, and exclusive logistics perks.",
//       months: "3-month",
//     },
//     {
//       id: 5,
//       title: "Standard Membership",
//       description:
//         " Gain access to WISAL's platform with basic selling features and customer support.",
//       months: "6-month",
//     },
//     {
//       id: 6,
//       title: "Premium Membership",
//       description:
//         "Unlock enhanced selling features, commission discounts, and exclusive logistics perks.",
//       months: "6-month",
//     },
//   ];

//   return (
//     <>
//       <Header />
//       <BottomNavbar />

//       <div className="categories-container">
//         <h2 className="section-title">Select Subscription</h2>
//         <div className="categories-grid">
//           {categories.map((category) => (
//             <div className="category-card" key={category.id}>
//               <input
//                 type="radio"
//                 id={`membership-${category.id}`}
//                 name="membership"
//                 value={category.id}
//                 onChange={() => setSelectedMembership(category)}
//               />
//               <label htmlFor={`membership-${category.id}`} className="category-label">
//                 <div className="category-info">
//                   <h3 className="category-title">{category.title}</h3>
//                   <p className="category-description">{category.description}</p>
//                 </div>
//                 <p className="category-months">{category.months}</p>
//               </label>
//             </div>
//           ))}
//         </div>
//         <Link
//   to="/"
//   className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//   style={{ margin: '10px', marginBottom: '26px' }}
//   onClick={handleNavigate}
// >
//   Submit
// </Link>

//       </div>
//     </>
//   );
// };

// export default RegisterrPage;
