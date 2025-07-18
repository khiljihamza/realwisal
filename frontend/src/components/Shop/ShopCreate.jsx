import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { useTranslation } from 'react-i18next';
import "./PricingApp.css";


const ShopCreate = () => {
    const [selectMonthly, setSelectMonthly] = useState(true);
    // const [selectedPlan, setSelectedPlan] = useState(null); // Track selected plan


  const navigate = useNavigate();
  const { t, i18n } = useTranslation('en');
  const [language, setLanguage] = useState(i18n.language);

  // State for form fields
 
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");

  // const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");

  const [businessType, setBusinessType] = useState("");
  const [tradelicenseNumber, setTradelicenseNumber] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  // const [tradeLicense, setTradeLicense] = useState(null);

  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [visible, setVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);

  // Handle language change
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang ? 'ar' : 'en');
    setLanguage(lang ? 'ar' : 'en');
  };

  // Update document direction based on language
  useEffect(() => {
    document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
  }, [i18n.language]);

   // PricingCard component inside App
   const PricingCard = ({ title, price, storage, users, sendUp, onSelect, isSelected }) => {
    return (
      <div className={`PricingCard ${isSelected ? "selected" : ""}`}>
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
            checked={isSelected}
            onChange={onSelect}
          />
          <label >{t("Select")}</label>
        </div>
        {/* <button className="card-btn" onClick={handleSubmit}>{t("Submit")}</button> */}

      </div>
    );
  };

   // Handle trade license file input change
  //  const handleTradeLicenseChange = (e) => {
  //   setTradeLicense(e.target.files[0]);
  // };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    formData.append('businessName', businessName);
    formData.append('businessCategory', businessCategory);
    formData.append('password', password);

    // formData.append('avatar', avatar);
    formData.append('businessType', businessType);
    formData.append('tradelicenseNumber', tradelicenseNumber);
    formData.append('registerNumber', registerNumber);
    // if (tradeLicense) {
    //   formData.append('tradeLicense', tradeLicense);
    // }

    formData.append('bankName', bankName);
    formData.append('accountHolderName', accountHolderName);
    formData.append('accountNumber', accountNumber);
    // formData.append('selectedPlan', selectedPlan); // Add selected plan to form data


    try {
      const res = await axios.post(`${server}/shop/create-shop`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message);
      // Reset form fields
      setName("");
      setPhoneNumber("");
      setEmail("");
      setBusinessName("");
      setBusinessCategory("");
      setPassword("");

      // setAvatar(null);
      setBusinessType("");
      setTradelicenseNumber("");
      setRegisterNumber("");
      // setTradeLicense(null);

      setBankName("");
      setAccountHolderName("");
      setAccountNumber("");
      // setSelectedPlan(null); // Reset selected plan
      navigate('/dashboard'); // Redirect after successful submission
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle avatar file input change
  // const handleAvatarChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (reader.readyState === 2) {
  //         setAvatar(reader.result);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {currentSection === 1
            ? t("Basic Information")
            : currentSection === 2
            ? t("Business Details")
            : currentSection === 3
            ? t("Bank Details")
            : t("Select Subscription")}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[45rem]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            {currentSection === 1 && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t("Full Name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                    {t("Phone Number")}
                  </label>
                  <input
                    type="number"
                    name="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t("Email Address")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t("password")}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                    {t("Business Name")}
                  </label>
                  <input
                    type="text"
                    name="business-name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="business-category" className="block text-sm font-medium text-gray-700">
                    {t("Business Category")}
                  </label>
                  <input
                    type="text"
                    name="business-category"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </>
            )}

            {/* Business Details Section */}
            {currentSection === 2 && (
              <>
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                    {t("Business Type")}
                  </label>
                  <input
                    type="text"
                    name="businessType"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="Trade-License-Number" className="block text-sm font-medium text-gray-700">
                    {t("Trade License Number")}
                  </label>
                  <input
                    type="text"
                    name="tradelicensenumber"
                    value={tradelicenseNumber}
                    onChange={(e) => setTradelicenseNumber(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="registerNumber" className="block text-sm font-medium text-gray-700">
                    {t("Register Number")}
                  </label>
                  <input
                    type="text"
                    name="registernumber"
                    value={registerNumber}
                    onChange={(e) => setRegisterNumber(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="trade-license" className="block text-sm font-medium text-gray-700">
                    {t("Upload Trade License Document")}
                  </label>
                  <input
                    type="file"
                    // name="trade-license"
                    // onChange={handleTradeLicenseChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </>
            )}

            {/* Bank Details Section */}
            {currentSection === 3 && (
              <>
                <div>
                  <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700">
                    {t("Bank Name")}
                  </label>
                  <input
                    type="text"
                    name="bank-name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="account-holder-name" className="block text-sm font-medium text-gray-700">
                    {t("Account Holder Name")}
                  </label>
                  <input
                    type="text"
                    name="account-holder-name"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="account-number" className="block text-sm font-medium text-gray-700">
                    {t("IBAN Number")}
                  </label>
                  <input
                    type="text"
                    name="account-number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </>
            )}

             {/* Bank Details Section */}
             {currentSection === 4 && (
              <>
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
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
  {currentSection > 1 && (
    <button
      type="button"
      onClick={() => setCurrentSection((prev) => prev - 1)}
      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
    >
      {t("Previous")}
    </button>
  )}

  {currentSection < 4 && (
    <button
      type="button"
      onClick={() => setCurrentSection((prev) => prev + 1)}
      className="px-4 py-2 bg-blue-600 text-white rounded-md"
    >
      {t("Next")}
    </button>
  )}

  {currentSection === 4 && (
    <button
      type="submit"
      className="px-4 py-2 bg-green-600 text-white rounded-md"
    >
      {t("Submit")}
    </button>
  )}
</div>


            <div className={`${styles.noramlFlex} w-full`}>
              <h4>{t("Already have an account")}?</h4>
              <Link to="/shop-login" className="text-blue-600 pl-2">
                {t("Sign In")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;










// import React, { useState, useEffect } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import styles from "../../styles/styles";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';
// import { server } from "../../server";
// import { toast } from "react-toastify";
// import { RxAvatar } from "react-icons/rx";
// import { useTranslation } from 'react-i18next';


// const ShopCreate = () => {
//   const navigate = useNavigate(); // Hook to get navigate function

//   const handleNavigate = () => {
//     navigate('/shop-register'); // Programmatically navigate to /shop-register
//   };

//   const [businessName, setBusinessName] = useState("");
//   const [businessCategory, setBusinessCategory] = useState("");
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [address, setAddress] = useState("");
//   const [zipCode, setZipCode] = useState();
//   const [avatar, setAvatar] = useState();
//   const [password, setPassword] = useState("");
//   const [tradeLicense, setTradeLicense] = useState(null);
//   const [bankName, setBankName] = useState("");
//   const [visible, setVisible] = useState(false);
//   const [accountNumber, setAccountNumber] = useState("");

//   const [currentSection, setCurrentSection] = useState(1); // Track current section

//   const { t, i18n } = useTranslation('en');


//   const [language, setLanguage] = useState(i18n.language); // Get initial language

//   const handleLanguageChange = (lang) => {


//     i18n.changeLanguage(lang ? 'ar' : 'en'); // Set language based on checkbox state

//     setLanguage(lang ? 'ar' : 'en');
//   };


//   useEffect(() => {
//     document.documentElement.setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');
//   }, [i18n.language]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     axios
//       .post(`${server}/shop/create-shop`, {
       
//         name,
//         email,
//         password,
//         avatar,
//         zipCode,
//         address,
//         phoneNumber,
//         businessName,
//         businessCategory,
//         avatar,
//         tradeLicense,
//         bankName,
//         accountNumber,
//       })
//       .then((res) => {
//         toast.success(res.data.message);
//         // Reset fields after submission
//         setName("");
//         setEmail("");
//         setPassword("");
//         setAvatar();
//         setZipCode();
//         setAddress("");
//         setPhoneNumber();
//         setBusinessName();
//         setBusinessCategory();
//         setAvatar();
//         setTradeLicense();
//         setBankName();
//         setAccountNumber();
        
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//       });
//   };

//   const handleAvatarChange = (e) => {
//     setAvatar(e.target.files[0]);
//   };

//   const handleTradeLicenseChange = (e) => {
//     setTradeLicense(e.target.files[0]);
//   };

//   const handleFileInputChange = (e) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setAvatar(reader.result);
//       }
//     };
//     reader.readAsDataURL(e.target.files[0]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           {currentSection === 1
//             ? t("Basic Information")
//             : currentSection === 2
//             ? t("Business Details")
//             : t("Bank Details")}
//         </h2>
//       </div>
//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {/* Basic Information Section */}
//             {currentSection === 1 && (
//               <>
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   {t("Full Name")}
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
                    
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
//                   {t("Phone Number")}
//                   </label>
//                   <input
//                     type="number"
//                     name="phone-number"
                    
//                     value={phoneNumber}
//                     onChange={(e) => setPhoneNumber(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   {t("Email Address")}
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
                    
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                          <label
//                            htmlFor="email"
//                            className="block text-sm font-medium text-gray-700"
//                          >
//                            {t("Business Name")}
//                          </label>
//                          <div className="mt-1">
//                            <input
//                              type="address"
//                              name="address"
                             
//                              value={address}
//                              onChange={(e) => setAddress(e.target.value)}
//                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                            />
//                          </div>
//                        </div>

//                        <div>
//                          <label
//                            htmlFor="email"
//                            className="block text-sm font-medium text-gray-700"
//                          >
//                             {t("Business Category")}
//                          </label>
//                          <div className="mt-1">
//                            <input
//                              type="number"
//                              name="zipcode"
                             
//                              value={zipCode}
//                              onChange={(e) => setZipCode(e.target.value)}
//                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                            />
//                          </div>
//                        </div>
//               </>
//             )}

//             {/* Business Details Section */}
//             {currentSection === 2 && (
//               <>
//                 <div>
//                   <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
//                   {t("Business Type")}
//                   </label>
//                   <input
//                     type="text"
//                     name="business-name"
                    
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="business-category" className="block text-sm font-medium text-gray-700">
//                   {t("VAT Registration Number-Optional")}
//                   </label>
//                   <input
//                     type="text"
//                     name="business-category"
                    
//                     value={zipCode}
//                     onChange={(e) => setZipCode(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="trade-license-number" className="block text-sm font-medium text-gray-700">
//                   {t("Trade License Number")}
//                   </label>
//                   <input
//                     type="text"
//                     name="trade-license-number"
                    
//                     value={zipCode}
//                     onChange={(e) => setZipCode(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                <label
//                  htmlFor="avatar"
//                  className="block text-sm font-medium text-gray-700"
//                ></label>
//                <div className="mt-2 flex items-center">
//                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
//                    {avatar ? (
//                      <img
//                        src={avatar}
//                        alt="avatar"
//                        className="h-full w-full object-cover rounded-full"
//                      />
//                    ) : (
//                      <RxAvatar className="h-8 w-8" />
//                    )}
//                  </span>
//                  <label
//                    htmlFor="file-input"
//                    className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                  >
//                    <span>{t("Upload Trade License Document")}</span>
//                    <input
//                      type="file"
//                      name="avatar"
//                      id="file-input"
//                     //  onChange={handleFileInputChange}
//                      className="sr-only"
//                    />
//                  </label>
//                </div>
//              </div>
//               </>
//             )}

//             {/* Bank Details Section */}
//             {currentSection === 3 && (
//               <>
//                 <div>
//                   <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700">
//                   {t("Bank Name")}
//                   </label>
//                   <input
//                     type="text"
//                     name="bank-name"
                    
//                     value={bankname}
//                     onChange={(e) => setZipCode(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="account-holder-name" className="block text-sm font-medium text-gray-700">
//                   {t("Account Holder Name")}
//                   </label>
//                   <input
//                     type="text"
//                     name="account-holder-name"
                    
//                     value={holdername}
//                     onChange={(e) => setZipCode(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="iban-number" className="block text-sm font-medium text-gray-700">
//                   {t("IBAN Number")}
//                   </label>
//                   <input
//                     type="text"
//                     name="iban-number"
                    
//                     value={ibannumber}
//                     onChange={(e) => setZipCode(e.target.value)}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//               </>
//             )}

//             {/* Navigation Buttons */}
//             <div className="flex justify-between">
//               {currentSection > 1 && (
//                 <button
//                   type="button"
//                   className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                   onClick={() => setCurrentSection(currentSection - 1)}
//                 >
//                   {t("Previous")}
//                 </button>
//               )}

//               {currentSection < 3 ? (
//                 <button
//                   type="button"
//                   className="ml-3 group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                   onClick={() => setCurrentSection(currentSection + 1)}
//                 >
//                   {t("Next")}
//                 </button>
//               ) : (
//                 <Link to="/shop-premium"
//                   className="ml-3 group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                   onClick={handleNavigate}
//                 >
//                   {t("Proceed")}
//                 </Link>
//               )}
//             </div>

//             <div className={`${styles.noramlFlex} w-full`}>
//                <h4>{t("Already have an account")}?</h4>
//                <Link to="/shop-login" className="text-blue-600 pl-2">
//                {t("Sign In")}
//                </Link>
//              </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopCreate;













// import { React, useState } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import styles from "../../styles/styles";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { server } from "../../server";
// import { toast } from "react-toastify";
// import { RxAvatar } from "react-icons/rx";

// const ShopCreate = () => {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState();
//   const [address, setAddress] = useState("");
//   const [zipCode, setZipCode] = useState();
//   const [avatar, setAvatar] = useState();
//   const [password, setPassword] = useState("");
//   const [visible, setVisible] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     axios
//       .post(`${server}/shop/create-shop`, {
//         name,
//         email,
//         password,
//         avatar,
//         zipCode,
//         address,
//         phoneNumber,
//       })
//       .then((res) => {
//         toast.success(res.data.message);
//         setName("");
//         setEmail("");
//         setPassword("");
//         setAvatar();
//         setZipCode();
//         setAddress("");
//         setPhoneNumber();
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//       });
//   };

//   const handleFileInputChange = (e) => {
//     const reader = new FileReader();

//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setAvatar(reader.result);
//       }
//     };

//     reader.readAsDataURL(e.target.files[0]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//         Basic Information
//         </h2>
//       </div>
//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                  Full Name
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="name"
//                   name="name"
//                   
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Phone Number
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="phone-number"
//                   required
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="email"
//                   name="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Business Name
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="address"
//                   name="address"
//                   required
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                  Business Category
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="zipcode"
//                   required
//                   value={zipCode}
//                   onChange={(e) => setZipCode(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//         Business Details
//         </h2>
//       </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                  Business Type
//               </label>
//               <div className="mt-1 relative">
//                 <input
//                   type={visible ? "text" : "password"}
//                   name="password"
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//                 {visible ? (
//                   <AiOutlineEye
//                     className="absolute right-2 top-2 cursor-pointer"
//                     size={25}
//                     onClick={() => setVisible(false)}
//                   />
//                 ) : (
//                   <AiOutlineEyeInvisible
//                     className="absolute right-2 top-2 cursor-pointer"
//                     size={25}
//                     onClick={() => setVisible(true)}
//                   />
//                 )}
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                   Trade License Number
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="zipcode"
//                   required
//                   value={zipCode}
//                   onChange={(e) => setZipCode(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>


        

//             <div>
//               <label
//                 htmlFor="avatar"
//                 className="block text-sm font-medium text-gray-700"
//               ></label>
//               <div className="mt-2 flex items-center">
//                 <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
//                   {avatar ? (
//                     <img
//                       src={avatar}
//                       alt="avatar"
//                       className="h-full w-full object-cover rounded-full"
//                     />
//                   ) : (
//                     <RxAvatar className="h-8 w-8" />
//                   )}
//                 </span>
//                 <label
//                   htmlFor="file-input"
//                   className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   <span>Upload Trade License Document</span>
//                   <input
//                     type="file"
//                     name="avatar"
//                     id="file-input"
//                     onChange={handleFileInputChange}
//                     className="sr-only"
//                   />
//                 </label>
//               </div>
//             </div>


                
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                   VAT Registration Number 
//                   (Optional)
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="zipcode"
//                   required
//                   value={zipCode}
//                   onChange={(e) => setZipCode(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>


//             <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//         Bank Details
//         </h2>
//       </div>

//       <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                  Bank Name
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="zipcode"
//                   required
//                   value={zipCode}
//                   onChange={(e) => setZipCode(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>


//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                  Account Holder Name
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="zipcode"
//                   required
//                   value={zipCode}
//                   onChange={(e) => setZipCode(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>



            
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                  IBAN Number
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="zipcode"
//                   required
//                   value={zipCode}
//                   onChange={(e) => setZipCode(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </div>
//             <div className={`${styles.noramlFlex} w-full`}>
//               <h4>Already have an account?</h4>
//               <Link to="/shop-login" className="text-blue-600 pl-2">
//                 Sign in
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopCreate;
