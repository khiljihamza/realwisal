import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomNavbar from "../Route/BottomNavbar/BottomNavbar";
import Header from "../Layout/Header";
import WISALlogo from '../images/wisall.png';
import VIP from '../images/vip.jpg';
import VIP1 from '../images/grapg.webp';
import VIP2 from '../images/uae.webp';
import VIP3 from '../images/care.jpg';
import "./RegisterrPage.css"; // Importing CSS file

const RegisterrPage = () => {

  const navigate = useNavigate(); // Hook to get navigate function

   const { t, i18n } = useTranslation('en');
    
    
      const [language, setLanguage] = useState(i18n.language); // Get initial language
    
      const handleLanguageChange = (lang) => {
    
    
        i18n.changeLanguage(lang ? 'ar' : 'en'); // Set language based on checkbox state
    
        setLanguage(lang ? 'ar' : 'en');
      };
    
    
      useEffect(() => {
        document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
      }, [i18n.language]);
  

  const handleNavigate = () => {
    navigate('/shop-create'); // Programmatically navigate to /shop-register
  };

  const benefits = [
    {
      title: t('choose1'),
      description:
      t('low_commissions'),
    },
    {
      title: t('choose2'),
      description:
      t('premium_membership_benefits'),
    },
    {
      title: t('choose3'),
      description:
      t('advertising_opportunities'),
    },
    {
      title: t('choose4'),
      description:
      t('logistics_partnership'),
    },
  ];

  const Pricing = [
    {
      title: t('commission_rates'),
      description:
      t('commission_description'),
    },
    {
      title: t('logistics_costs'),
      description:
      t('logistics_description'),
    },
    {
      title: t('advertising_costs'),
      description:
      t('advertising_description'),
    }
  ];

  const categories = [
    {
      title: t('electronics'),
      description: t('electronics_category'),
    },
    {
      title: t('fashion'),
      description: t('fashion_category'),
    },
    {
      title: t('furniture'),
      description: t('furniture_category'),
    },
    {
      title: t('home_appliances'),
      description: t('home_appliances_category'),
    },
    {
      title: t('pet_care'),
      description: t('pet_care_category'),
    },
    {
      title: t('food_health'),
      description: t('beauty_category'),
    },
    {
      title: t('Groceries'),
      description: t('groceries_category'),
    },
    {
      title: t('Books'),
      description: t('books_category'),
    },
    {
      title: t('Sports'),
      description: t('sports_category'),
    },
    {
      title: t('Toys'),
      description: t('toys_category'),
    },
  ];
  return (
    <>
              <Header />
      {/* <BottomNavbar /> */}

      <div className="register-container">
      <div className="image-section">
          <img
            src={WISALlogo}
            alt="WISAL Logo"
            className="wisal-logo"
          />
        </div>
        <div className="text-section">
          <h1>{t('welcome_title')}</h1>
          <p>
          {t('welcome_description')}
          </p>
          <button className="register-button" onClick={handleNavigate}>
          {t('register_button')}
      </button>


        </div>
       
      </div>

      <div className="why-choose-container">
        <h2 className="section-title">{t('choose')}</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="categories-container">
        <h2 className="section-title">{t('sell_categories_title')}</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>
              <h3 className="category-title">{category.title}</h3>
              <p className="category-description">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="why-choose-containerr">
        <h2 className="sectionn-title">{t('pricing_structure')}</h2>
        <div className="benefitts-grid">
          {Pricing.map((benefit, index) => (
            <div className="benefitt-card" key={index}>
              <h3 className="benefitt-title">{benefit.title}</h3>
              <p className="benefitt-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="join-wisal-container">
        <h2 className="sectionn-title">{t('how_to_join')}</h2>
        <div className="timeline">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-label">{t('register_seller')}</div>
          </div>
          <div className="line"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-label">{t('select_plan')}</div>
          </div>
          <div className="line"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-label">{t('list_products')}</div>
          </div>
          <div className="line"></div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-label">{t('start_selling')}</div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="vip-badge">
          <img
            src={VIP}
            alt="VIP Badge"
            className="vip-image"
          />
        </div>

        <div className="content">
          <h2>{t('premium_membership')}</h2>

          <div className="perk">
            <div className="perk-number">1</div>
            <div className="perk-title">{t('discount_commissions')}</div>
            <div className="perk-description">{t('discount_commissions_description')}</div>
          </div>

          <div className="perk">
            <div className="perk-number">2</div>
            <div className="perk-title">{t('logistics_discounts')}</div>
            <div className="perk-description">{t('logistics_discounts_description')}</div>
          </div>

          <div className="perk">
            <div className="perk-number">3</div>
            <div className="perk-title">{t('priority_access')}</div>
            <div className="perk-description">{t('priority_access_description')}</div>
          </div>
        </div>
      </div>

      <div className="why-choose-container">

        <div className="sectionn-title">
      <h1>{t('why_sellers_love')}</h1>
      </div>
      <div className="containerW">

      <div className="sectionW">
        <img src={VIP1} alt="Online Marketplace Fees" />
        <h2 className="perk-title">{t('cost_effective_selling')}</h2>
        <p>{t('cost_effective_selling_description')}</p>
      </div>

      <div className="sectionW">
        <img src={VIP2} alt="Wide Reach" />
        <h2 className="perk-title">{t('wide_reach')}</h2>
        <p>{t('wide_reach_description')}</p>
      </div>

      <div className="sectionW">
        <img src={VIP3} alt="Seller Support" />
        <h2 className="perk-title">{t('seller_support')}</h2>
        <p>{t('seller_support_description')}</p>
      </div>
    </div>
    </div>

    <div className="containerq">
      <h1>{t('contact_us_title')}</h1>

      <div className="contact-info">
        <div className="info-item">
          <span className="number">1</span>
          <h3>Email</h3>
          <a href="mailto:shoebbirader@gmail.com">shoebbirader@gmail.com</a>
        </div>

        <div className="info-item">
          <span className="number">2</span>
          <h3>Phone</h3>
          <a href="tel:+918999941541">+918999941541</a>
        </div>

        <div className="info-item">
          <span className="number">3</span>
          <h3>Office</h3>
          <p>Dubai, UAE</p>
        </div>
      </div>
    </div>

    <div className="register-container">
        <div className="text-section">
          <h1>{t('ready_to_join')}</h1>
          <button className="register-button" onClick={handleNavigate}>{t('register_button')}</button>
        </div>
      </div>

    </>
  );
};

export default RegisterrPage;























// import React from "react";
// import { useNavigate } from 'react-router-dom';
// import BottomNavbar from "../Route/BottomNavbar/BottomNavbar";
// import Header from "../Layout/Header";
// import WISALlogo from '../images/wisall.png';
// import VIP from '../images/vip.jpg';
// import VIP1 from '../images/grapg.webp';
// import VIP2 from '../images/uae.webp';
// import VIP3 from '../images/care.jpg';
// import "./RegisterrPage.css"; // Importing CSS file

// const RegisterrPage = () => {

//   const navigate = useNavigate(); // Hook to get navigate function

//   const handleNavigate = () => {
//     navigate('/shop-create'); // Programmatically navigate to /shop-register
//   };

//   const benefits = [
//     {
//       title: "Low Commissions",
//       description:
//         "We offer 40% lower commission rates compared to other platforms like Noon. Sellers save more while still reaching thousands of buyers across the UAE.",
//     },
//     {
//       title: "Premium Membership Benefits",
//       description:
//         "Upgrade to a premium membership and enjoy 50% off on commissions and discounts on logistics costs. Gain exclusive access to premium tools to boost visibility and increase conversions.",
//     },
//     {
//       title: "Advertising Opportunities",
//       description:
//         "Promote your products through targeted advertising campaigns on the WISAL platform. Flexible ad packages tailored to your needs help you stand out and increase sales.",
//     },
//     {
//       title: "Streamlined Logistics",
//       description:
//         "We partner with leading logistics providers to ensure smooth and reliable delivery for your customers. Enjoy affordable logistics rates and efficient order fulfillment with our logistics solutions.",
//     },
//   ];

//   const Pricing = [
//     {
//       title: "Commission Rates",
//       description:
//         "Standard sellers: Lesser Commission than other marketplaces. Premium sellers: 50% off on commissions.",
//     },
//     {
//       title: "Logistics Costs",
//       description:
//         "Competitive logistics rates are passed directly to sellers.",
//     },
//     {
//       title: "Advertising Costs",
//       description:
//         "Starting at AED 500, run targeted ad campaigns on the WISAL platform. Choose between product promotions, homepage banners, and category-specific ads to reach your desired audience.",
//     }
//   ];

//   const categories = [
//     {
//       title: "Electronics",
//       description: "Smartphones, Laptops, Tablets, Accessories",
//     },
//     {
//       title: "Fashion",
//       description: "Men, Women, and Kids' Clothing & Accessories",
//     },
//     {
//       title: "Furniture",
//       description: "Indoor and Outdoor Furniture",
//     },
//     {
//       title: "Home Appliances",
//       description: "Kitchen Appliances, Cleaning Devices",
//     },
//     {
//       title: "Pet Care",
//       description: "Pet Food, Toys, and Accessories",
//     },
//     {
//       title: "Health & Personal Care",
//       description: "Beauty Products, Wellness Items",
//     },
//     {
//       title: "Groceries",
//       description: "Fresh Produce, Packaged Goods",
//     },
//     {
//       title: "Books & Stationery",
//       description: "Textbooks, Office Supplies",
//     },
//     {
//       title: "Sports & Fitness",
//       description: "Equipment, Activewear",
//     },
//     {
//       title: "Toys & Games",
//       description: "Children's Products, Board Games",
//     },
//   ];
//   return (
//     <>
//               <Header />
//       <BottomNavbar />

//       <div className="register-container">
//         <div className="text-section">
//           <h1>Welcome to WISAL – Your Trusted E-commerce Partner</h1>
//           <p>
//             WISAL is your one-stop shop for launching and growing your online
//             business in the UAE. We empower sellers with low commissions, premium
//             membership benefits, and targeted advertising solutions.
//           </p>
//           <button className="register-button" onClick={handleNavigate}>
//         Register as a Seller
//       </button>


//         </div>
//         <div className="image-section">
//           <img
//             src={WISALlogo}
//             alt="WISAL Logo"
//             className="wisal-logo"
//           />
//         </div>
//       </div>

//       <div className="why-choose-container">
//         <h2 className="section-title">Why Choose WISAL?</h2>
//         <div className="benefits-grid">
//           {benefits.map((benefit, index) => (
//             <div className="benefit-card" key={index}>
//               <h3 className="benefit-title">{benefit.title}</h3>
//               <p className="benefit-description">{benefit.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="categories-container">
//         <h2 className="section-title">Sell Across Diverse Categories</h2>
//         <div className="categories-grid">
//           {categories.map((category, index) => (
//             <div className="category-card" key={index}>
//               <h3 className="category-title">{category.title}</h3>
//               <p className="category-description">{category.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="why-choose-containerr">
//         <h2 className="sectionn-title">WISAL Pricing Structure</h2>
//         <div className="benefitts-grid">
//           {Pricing.map((benefit, index) => (
//             <div className="benefitt-card" key={index}>
//               <h3 className="benefitt-title">{benefit.title}</h3>
//               <p className="benefitt-description">{benefit.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="join-wisal-container">
//         <h2 className="sectionn-title">How to Join WISAL?</h2>
//         <div className="timeline">
//           <div className="step">
//             <div className="step-number">1</div>
//             <div className="step-label">Register as a Seller</div>
//           </div>
//           <div className="line"></div>
//           <div className="step">
//             <div className="step-number">2</div>
//             <div className="step-label">Select Your Plan</div>
//           </div>
//           <div className="line"></div>
//           <div className="step">
//             <div className="step-number">3</div>
//             <div className="step-label">List Your Products</div>
//           </div>
//           <div className="line"></div>
//           <div className="step">
//             <div className="step-number">4</div>
//             <div className="step-label">Start Selling</div>
//           </div>
//         </div>
//       </div>

//       <div className="container">
//         <div className="vip-badge">
//           <img
//             src={VIP}
//             alt="VIP Badge"
//             className="vip-image"
//           />
//         </div>

//         <div className="content">
//           <h2>Premium Membership - Unlock Exclusive Perks</h2>

//           <div className="perk">
//             <div className="perk-number">1</div>
//             <div className="perk-title">50% Discount on Commissions</div>
//             <div className="perk-description">Save significantly on your commission fees.</div>
//           </div>

//           <div className="perk">
//             <div className="perk-number">2</div>
//             <div className="perk-title">Logistics Discounts</div>
//             <div className="perk-description">Enjoy reduced rates on every order fulfillment.</div>
//           </div>

//           <div className="perk">
//             <div className="perk-number">3</div>
//             <div className="perk-title">Priority Access</div>
//             <div className="perk-description">Gain early access to promotional campaigns and exclusive seller tools.</div>
//           </div>
//         </div>
//       </div>

//       <div className="why-choose-container">

//         <div className="sectionn-title">
//       <h1>Why Sellers Love WISAL</h1>
//       </div>
//       <div className="containerW">

//       <div className="sectionW">
//         <img src={VIP1} alt="Online Marketplace Fees" />
//         <h2 className="perk-title">Cost-Effective Selling</h2>
//         <p>Save on commissions, logistics, and advertising.</p>
//       </div>

//       <div className="sectionW">
//         <img src={VIP2} alt="Wide Reach" />
//         <h2 className="perk-title">Wide Reach</h2>
//         <p>Tap into the growing UAE e-commerce market.</p>
//       </div>

//       <div className="sectionW">
//         <img src={VIP3} alt="Seller Support" />
//         <h2 className="perk-title">Seller Support</h2>
//         <p>Our dedicated team ensures your success every step of the way.</p>
//       </div>
//     </div>
//     </div>

//     <div className="containerq">
//       <h1>Contact Us</h1>

//       <div className="contact-info">
//         <div className="info-item">
//           <span className="number">1</span>
//           <h3>Email</h3>
//           <a href="mailto:shoebbirader@gmail.com">shoebbirader@gmail.com</a>
//         </div>

//         <div className="info-item">
//           <span className="number">2</span>
//           <h3>Phone</h3>
//           <a href="tel:+918999941541">+918999941541</a>
//         </div>

//         <div className="info-item">
//           <span className="number">3</span>
//           <h3>Office</h3>
//           <p>Dubai, UAE</p>
//         </div>
//       </div>
//     </div>

//     <div className="register-container">
//         <div className="text-section">
//           <h1>Ready to Join WISAL?</h1>
//           <button className="register-button" onClick={handleNavigate}>Register as a Seller</button>
//         </div>
//       </div>

//     </>
//   );
// };

// export default RegisterrPage;