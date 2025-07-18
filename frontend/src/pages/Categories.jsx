import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData, mainCategoriesData } from "../static/data";
// import Headerr from "../components/Layout/Headerr";
import BottomNavbar from "../components/Route/BottomNavbar/BottomNavbar";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { FaSearch } from "react-icons/fa"; // Importing a search icon from react-icons

const Categories = () => {
  const navigate = useNavigate();

  const groupNames = ["Popular Store", "Featured Picks", "Best Deals", "More on Wisal", "Trending Now"];

  const { t, i18n } = useTranslation('en');


  const [language, setLanguage] = useState(i18n.language); // Get initial language

  const handleLanguageChange = (lang) => {


    i18n.changeLanguage(lang ? 'ar' : 'en'); // Set language based on checkbox state

    setLanguage(lang ? 'ar' : 'en');
  };


  useEffect(() => {
    document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);


  // Mapping main categories to their related categories
  const categoryMapping = {
    "For You": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    Home: [1, 4, 5],
    Fasion: [6, 7],
    Appliances: [8, 9],
    Mobiles: [10],
    Electronics: [11],
  };

  const [filteredCategories, setFilteredCategories] = useState(categoriesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  const handleMainCategoryClick = (mainCategory) => {
    console.log(`Main category selected: ${mainCategory.title}`);
    setSelectedMainCategory(mainCategory.title); // Update selected category
    const relatedCategoryIds = categoryMapping[mainCategory.title] || [];
    const filtered = categoriesData.filter((category) =>
      relatedCategoryIds.includes(category.id)
    );
    setFilteredCategories(filtered);
  };

  const handleCategoryClick = (category) => {
    navigate('/VideoGrid');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = categoriesData.filter(category =>
      category.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  return (
    <>
      <BottomNavbar />

      {/* Container for "All Categories" and Search Icon */}
      <div className="flex items-center justify-between mb-1 mt-1">
        <p className="mx-4 font-bold">All Categories</p>
        <FaSearch className="mr-4 text" />
      </div>

      {/* Branding Section */}
      {/* <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-6 flex justify-between w-full shadow-sm bg-white p-3 rounded-md`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-2">
                  <h3 className="font-bold text-xs md:text-sm">{t(i.title)}</h3>
                  <p className="text-[10px] md:text-xs">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div> */}

      {/* Categories Section with Sidebar */}
      <div
        className={`${styles.section} flex bg-white p-4 rounded-lg mb-8`}
        id="categories"
      >
        {/* Sidebar */}
        <div
          className="w-1/4 pr-4 border-r"
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            scrollbarWidth: "thin",
          }}
        >
          <ul className="space-y-2">
            {mainCategoriesData &&
              mainCategoriesData.map((mainCategory, index) => (
                <li
                  key={index}
                  className={`flex flex-col items-center cursor-pointer rounded-md p-2 
                    ${selectedMainCategory === mainCategory.title ? "bg-blue-100 text-blue-600" : "hover:text-blue-600"}`}
                  onClick={() => handleMainCategoryClick(mainCategory)}
                >
                  <img
                    src={mainCategory.image_Url}
                    alt={mainCategory.title}
                    className="w-9 h-9 object-cover rounded-full"
                  />
                  <span className="text-[10px] text-center">{t(mainCategory.title)}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Categories Grid */}
        <div className="w-3/4 pl-4">
          <div className="grid grid-cols-3 gap-4">
            {filteredCategories.map((category, index) => (
              <React.Fragment key={category.id}>
                {/* Display a new name for every set of 4 categories */}
                {index % 4 === 0 && (
                  <p className="col-span-3 font-bold">
                    {groupNames[Math.floor(index / 4) % groupNames.length]}
                  </p>
                )}
                <div
                  className="w-full flex flex-col items-center justify-center cursor-pointer rounded-full overflow-hidden shadow-sm border hover:shadow-md"
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    background: "#f9f9f9",
                    height: "80px",
                    width: "75px",
                  }}
                >
                  <img
                    src={category.image_Url}
                    className="w-[50px] h-[50px] object-cover"
                    alt={category.title}
                  />
                  <h5 className="text-[9px] font-medium text-center">
                  {t(category.title)}
                  </h5>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Categories;





















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { brandingData, categoriesData, mainCategoriesData } from "../static/data";
// // import Headerr from "../components/Layout/Headerr";
// import Footer from "../components/Layout/Footer";
// import styles from "../styles/styles";

// const Categories = () => {
//   const navigate = useNavigate();

//   // Mapping main categories to their related categories
//   const categoryMapping = {
//     "For You": [1, 2, 3, 4, 5, 6,7,8,9,10], // IDs of related categories
//     Groceries: [1,4, 5],
//     Fasion: [6, 7],
//     Appliances: [8, 9],
//     Mobiles: [10],
//     Electronics: [11],
//     // Add other main categories here
//   };

//   const [filteredCategories, setFilteredCategories] = useState(categoriesData);

//   const handleMainCategoryClick = (mainCategory) => {
//     console.log(`Main category selected: ${mainCategory.title}`);
//     const relatedCategoryIds = categoryMapping[mainCategory.title] || [];
//     const filtered = categoriesData.filter((category) =>
//       relatedCategoryIds.includes(category.id)
//     );
//     setFilteredCategories(filtered);
//   };

//   const handleCategoryClick = (category) => {
//     // navigate(`/products?category=${category.title}`);
//     navigate('/VideoGrid');
//   };

//   return (
//     <>
//       {/* <Headerr activeHeading={3} /> */}
//       <p className="mx-4 font-bold">All Categories</p>

//       {/* Branding Section */}
//       <div className={`${styles.section} hidden sm:block`}>
//         <div
//           className={`branding my-6 flex justify-between w-full shadow-sm bg-white p-3 rounded-md`}
//         >
//           {brandingData &&
//             brandingData.map((i, index) => (
//               <div className="flex items-start" key={index}>
//                 {i.icon}
//                 <div className="px-2">
//                   <h3 className="font-bold text-xs md:text-sm">{i.title}</h3>
//                   <p className="text-[10px] md:text-xs">{i.Description}</p>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* Categories Section with Sidebar */}
//       <div
//         className={`${styles.section} flex bg-white p-4 rounded-lg mb-8`}
//         id="categories"
//       >
//         {/* Sidebar */}
//         <div
//           className="w-1/4 pr-4 border-r"
//           style={{
//             maxHeight: "500px",
//             overflowY: "auto",
//             scrollbarWidth: "thin",
//           }}
//         >
//           <ul className="space-y-4">
//             {mainCategoriesData &&
//               mainCategoriesData.map((mainCategory, index) => (
//                 <li
//                   key={index}
//                   className="flex flex-col items-center cursor-pointer hover:text-blue-600"
//                   onClick={() => handleMainCategoryClick(mainCategory)}
//                 >
//                   <img
//                     src={mainCategory.image_Url}
//                     alt={mainCategory.title}
//                     className="w-9 h-9 object-cover rounded-full"
//                   />
//                   <span className="text-[10px] text-center">{mainCategory.title}</span>
//                 </li>
//               ))}
//           </ul>
//         </div>

//         {/* Categories Grid */}
//         <div className="w-3/4 pl-4">
//           <div className="grid grid-cols-3 gap-4">
//             {filteredCategories.map((category) => (
//               <div
//                 key={category.id}
//                 className="w-full flex flex-col items-center justify-center cursor-pointer rounded-lg overflow-hidden shadow-sm border hover:shadow-md"
//                 onClick={() => handleCategoryClick(category)}
//                 style={{
//                   background: "#f9f9f9",
//                   height: "80px",
//                   width: "75px",
//                 }}
//               >
//                 <img
//                   src={category.image_Url}
//                   className="w-[50px] h-[50px] object-cover"
//                   alt={category.title}
//                 />
//                 <h5 className="text-[9px] font-medium text-center">
//                   {category.title}
//                 </h5>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Categories;