import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";
import { useTranslation } from 'react-i18next';


const Categories = () => {
  const navigate = useNavigate();

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
                  <h3 className="font-bold text-xs md:text-sm">{i.title}</h3>
                  <p className="text-[10px] md:text-xs">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div> */}

      {/* Categories Section */}
      <div
  className={`${styles.section} bg-white p-1 rounded-lg mb-4`}
  id="categories"
>
  <div className="grid grid-cols-4">
    {/* Adjusted to 4 categories per row */}
    {categoriesData &&
      categoriesData.map((i) => {
        const handleSubmit = (i) => {
          navigate(`/products?category=${i.title}`);
        };
        return (
          <div
            className="w-full flex flex-col items-center justify-center cursor-pointer rounded-lg overflow-hidden hover:shadow-md"
            key={i.id}
            onClick={() => handleSubmit(i)}
            style={{
              // background: "#f9f9f9",
              height: "80px", // Height of the category card
            }}
          >
            <img
              src={i.image_Url}
              className="w-[50px] h-[50px] object-cover mb-2" // Image size
              alt={i.title}
            />
            <h5 className="text-[11px] font-bold text-center">
            {t(i.title)}
            </h5>
          </div>
        );
      })}
  </div>
</div>

    </>
  );
};

export default Categories;






















// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { brandingData, categoriesData } from "../../../static/data";


// import styles from "../../../styles/styles";

// const Categories = () => {
//   const navigate = useNavigate();
//   return (
//     <>
//       <div className={`${styles.section} hidden sm:block`}>
//         <div
//           className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}
//         >
//           {brandingData &&
//             brandingData.map((i, index) => (
//               <div className="flex items-start" key={index}>
//                 {i.icon}
//                 <div className="px-3">
//                   <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
//                   <p className="text-xs md:text-sm">{i.Description}</p>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>

//       <div
//         className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
//         id="categories"
//       >
//         <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
//           {categoriesData &&
//             categoriesData.map((i) => {
//               const handleSubmit = (i) => {
//                 navigate(`/products?category=${i.title}`);
//               };
//               return (
//                 <div
//                   className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
//                   key={i.id}
//                   onClick={() => handleSubmit(i)}
//                 >
//                   <h5 className={`text-[18px] leading-[1.3]`}>{i.title}</h5>
//                   <img
//                     src={i.image_Url}
//                     className="w-[120px] object-cover"
//                     alt=""
//                   />
//                 </div>
//               );
//             })}
//         </div>
//       </div>

//     </>
//   );
// };

// export default Categories;
