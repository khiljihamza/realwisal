import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopCreate from "../components/Shop/ShopCreate";
// import Terms from "../components/Shop/Terms";
// import RegisterrPage from '../components/Shop/RegisterrPage';


const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isSeller,seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller === true){
      navigate(`/shop/${seller._id}`);
    }
  }, [])
  return (
    <div>
      <ShopCreate />
        {/* <RegisterrPage /> */}
        {/* <Terms /> */}
    </div>
  )
}

export default ShopCreatePage