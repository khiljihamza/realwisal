import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineShoppingCart, AiOutlineHeart, AiOutlineTag, AiOutlineQuestionCircle } from 'react-icons/ai'; // Import Ai icons
import BottomNavbar from '../components/Route/BottomNavbar/BottomNavbar';
import { FaCreditCard, FaCheckCircle, FaBell, FaCoins, FaLanguage, FaHome, FaEdit, FaUserCircle, FaQuestionCircle, FaStar, FaShoppingCart, FaQuestion, FaFileAlt } from 'react-icons/fa';
import WISALlogo from '../components/images/Sponsored.jpg';


const ButtonLayout = () => {
    return (
        <>
            <BottomNavbar />

            <div style={{ backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '80px' }}>
                {/* Header Section */}
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', marginTop: '4px' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>Hey! John Deo</h3>
                            <p style={{ margin: 0, color: 'gray' }}>Explore <span style={{ color: 'blue' }}>Plus</span></p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaCoins style={{ fontSize: '24px', color: 'gold', marginRight: '10px' }} />
                            {/* <span style={{ fontSize: '16px', color: '#f5a623' }}>0</span> */}
                        </div>
                    </div>
                    {/* First row with two buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px', marginTop: '10px' }}>
                        <button style={buttonStyle}>
                            <AiOutlineShoppingCart style={{ marginRight: '8px', color: 'blue', fontSize: '18px' }} />
                            Orders
                        </button>
                        <button style={buttonStyle}>
                            <AiOutlineHeart style={{ marginRight: '8px', color: 'blue', fontSize: '18px' }} />
                            Wishlist
                        </button>
                    </div>

                    {/* Second row with two buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <button style={buttonStyle}>
                            <AiOutlineTag style={{ marginRight: '8px', color: 'blue', fontSize: '18px' }} />
                            Coupons
                        </button>
                        <button style={buttonStyle}>
                            <AiOutlineQuestionCircle style={{ marginRight: '8px', color: 'blue', fontSize: '18px' }} />
                            Help Center
                        </button>
                    </div>
                </div>


                {/* Email Verification Section */}
                <div style={{ backgroundColor: '#f9f9f9', padding: '15px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Add/Verify your Email</p>
                        <p style={{ color: 'gray' }}>Get latest updates of your orders</p>
                    </div>
                    <button style={{ fontSize: '14px', backgroundColor: '#007aff', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '5px' }}>
                        Update
                    </button>
                </div>


                {/* Credit Options Section */}
                {/* <div style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '15px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Credit Options</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaCreditCard size={20} color="blue" style={{ marginRight: '10px' }} />
                            <div>
                                <p>Personal Loan up to Rs.10,00,000</p>
                                <p style={{ color: 'gray' }}>Interest rates from 10.99% | Instant Approval</p>
                            </div>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                    </div>

                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Credit Score</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaCheckCircle size={20} color="blue" style={{ marginRight: '10px' }} />
                            <div>
                                <p>Free credit score check</p>
                                <p style={{ color: 'gray' }}>Get detailed credit report instantly.</p>
                            </div>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                    </div>

                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Notifications</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <FaBell size={20} color="blue" style={{ marginRight: '10px' }} />
                            <div>
                                <p>Tap for latest updates and offers</p>
                            </div>
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                    </div>
                </div> */}



                <div style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '15px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Sponsored</p>
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <img
                            src={WISALlogo}
                            alt="Sponsored Content"
                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                        />
                    </div>
                </div>


                <div style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '15px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Account Settings</p>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaUserCircle size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Wisal Plus</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaEdit size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Edit Profile</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaCreditCard size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Saved Credit/Debit & Gift Cards</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaHome size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Saved Address</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaLanguage size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Select Language</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaBell size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Notification Settings</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>
                    </div>
                </div>


                <div style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '15px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>My Activities</p>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaStar size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Reviews</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaQuestionCircle size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Questions & Answers</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>
                    </div>
                </div>




                <div style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '15px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Earn With Wisal</p>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaShoppingCart size={20} color="blue" style={{ marginRight: '10px' }} />
                                <Link to="/shop-register"> <p style={{ margin: 0 }}>Sell on Wisal</p> </Link>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>
                    </div>
                </div>


                <div style={{ marginTop: '10px', backgroundColor: '#f9f9f9', padding: '15px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Feedback & Information</p>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaFileAlt size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Terms, Policies and Licences</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaQuestion size={20} color="blue" style={{ marginRight: '10px' }} />
                                <p style={{ margin: 0 }}>Browse FAQs</p>
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#666666' }}>&gt;</span>
                        </div>
                    </div>
                </div>



                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{ margin: '10px', padding: '5px 10px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#fff', color: 'blue', border: 'none', borderRadius: '5px', width: '700px' }}>
                        Log Out
                    </button>
                </div>


            </div>
        </>
    );
};

// Reusable button style
const buttonStyle = {
    marginTop: '1px',
    border: '1px solid gray',
    padding: '2px 8px',
    borderRadius: '5px',
    width: '155px',
    display: 'flex', // Flex for text and icon to be aligned side by side
    alignItems: 'center', // Vertically center the content
    justifyContent: 'center', // Horizontally center the content
};

const iconStyle = {
    marginRight: '8px',
    fontSize: '18px',
    color: '#007aff',
};

const cardStyle = {
    backgroundColor: '#f9f9f9',
    padding: '2px',
};

export default ButtonLayout;
