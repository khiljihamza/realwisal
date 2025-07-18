import React, { useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import BottomNavbar from "../Route/BottomNavbar/BottomNavbar";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { AiOutlineDelete } from "react-icons/ai";

import { toast } from "react-toastify";

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  // Calculate total price for all items
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.originalPrice,
    0
  );

  // Calculate total discount (original price - discount price) for all items
  const totalDiscount = cart.reduce(
    (acc, item) => acc + (item.originalPrice - item.discountPrice) * item.qty,
    0
  );

  // Platform fee (for example, a 5% fee)
  const platformFee = 3;

  // Calculate total amount after discount and platform fee
  const totalAmount = totalPrice - totalDiscount + platformFee;

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="w-full max-w-5xl bg-white shadow-sm rounded-md mb-16 items-center">
      <BottomNavbar />

      <div className="w-full max-w-5xl bg-white shadow-sm p-6 rounded-md">
        {cart && cart.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center">
            <h5 className="text-xl font-medium">Your Cart is Empty!</h5>
          </div>
        ) : (
          <>
            <div>
              {/* Cart Header */}
              <div className={`${styles.noramlFlex} pb-4 border-b`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart && cart.length} items
                </h5>
              </div>

              {/* Cart Items */}
              <div className="mt-4">
                {cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            <div className="w-full mt-6">
              {/* Price Details */}
              <div className="flex justify-between py-1">
                <h4 className="font-semibold">Total Price({cart && cart.length} itmes)</h4>
                <h4 className="font-semibold">₹{totalPrice}</h4>
              </div>
              <div className="flex justify-between">
                <h4 className="font-semibold">Discount</h4>
                <h4 className="font-semibold text-green-600">-₹{totalDiscount}</h4>
              </div>
              <div className="flex justify-between py-1">
                <h4 className="font-semibold">Platform Fee</h4>
                <h4 className="font-semibold">₹{platformFee}</h4>
              </div>
              <div className="flex justify-between py-1 border-t mt-2">
                <h4 className="font-semibold text-xl">Total Amount</h4>
                <h4 className="font-semibold text-xl">₹{totalAmount}</h4>
              </div>
              <div className="flex justify-between py-1 border-t mt-2">
                <h4 className="font-semibold text-green-600">You will save ₹{totalDiscount} on this order</h4>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout">
                <div className="h-[45px] flex items-center justify-center w-full bg-[#FFD700] rounded-md mt-2">
                  <h1 className="text-black text-[18px] font-[600]">
                    Place Order (₹{totalAmount.toFixed(2)})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b py-4 flex items-center">
      <div>
        <div
          className="bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] flex justify-center items-center cursor-pointer"
          onClick={() => increment(data)}
        >
          <HiPlus size={18} color="#fff" />
        </div>
        <span className="px-2">{data.qty}</span>
        <div
          className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
          onClick={() => decrement(data)}
        >
          <HiOutlineMinus size={16} color="#7d879c" />
        </div>
      </div>
      <img
        src={data?.images?.[0]?.url || "https://via.placeholder.com/130"}
        alt={data?.name || "Product Image"}
        className="w-[130px] h-auto ml-4 mr-4 rounded-md"
      />
      <div className="flex-grow">
        <h1>{data.name}</h1>
        <h4 className="font-[400] text-[15px] text-[#00000082]">{data.category}  {data.discountPrice} x {value}</h4>
        <div className="flex items-center space-x-4">
          <h4 className="font-[600] text-[15px] text-[green] font-Roboto">
            ₹{totalPrice}
          </h4>
          <h4 className="font-[400] text-[15px] text-[red] line-through">
            ₹{data.originalPrice}
          </h4>
        </div>

        <button
  className="mt-2 px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center space-x-1"
  onClick={() => removeFromCartHandler(data)}
>
  <AiOutlineDelete size={14} />
  <span>Remove</span>
</button>

      </div>
    </div>
  );
};

export default Cart;


















// import React, { useState } from "react";
// import { RxCross1 } from "react-icons/rx";
// import { IoBagHandleOutline } from "react-icons/io5";
// import { HiOutlineMinus, HiPlus } from "react-icons/hi";
// import styles from "../../styles/styles";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { addTocart, removeFromCart } from "../../redux/actions/cart";
// import { toast } from "react-toastify";

// const Cart = ({ setOpenCart }) => {
//   const { cart } = useSelector((state) => state.cart);
//   const dispatch = useDispatch();

//   const removeFromCartHandler = (data) => {
//     dispatch(removeFromCart(data));
//   };

//   const totalPrice = cart.reduce(
//     (acc, item) => acc + item.qty * item.discountPrice,
//     0
//   );

//   const quantityChangeHandler = (data) => {
//     dispatch(addTocart(data));
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
//       <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
//         {cart && cart.length === 0 ? (
//           <div className="w-full h-screen flex items-center justify-center">
//             <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
//               <RxCross1
//                 size={25}
//                 className="cursor-pointer"
//                 onClick={() => setOpenCart(false)}
//               />
//             </div>
//             <h5>Cart Items is empty!</h5>
//           </div>
//         ) : (
//           <>
//             <div>
//               <div className="flex w-full justify-end pt-5 pr-5">
//                 <RxCross1
//                   size={25}
//                   className="cursor-pointer"
//                   onClick={() => setOpenCart(false)}
//                 />
//               </div>
//               {/* Item length */}
//               <div className={`${styles.noramlFlex} p-4`}>
//                 <IoBagHandleOutline size={25} />
//                 <h5 className="pl-2 text-[20px] font-[500]">
//                   {cart && cart.length} items
//                 </h5>
//               </div>

//               {/* cart Single Items */}
//               <br />
//               <div className="w-full border-t">
//                 {cart &&
//                   cart.map((i, index) => (
//                     <CartSingle
//                       key={index}
//                       data={i}
//                       quantityChangeHandler={quantityChangeHandler}
//                       removeFromCartHandler={removeFromCartHandler}
//                     />
//                   ))}
//               </div>
//             </div>

//             <div className="px-5 mb-3">
//               {/* checkout buttons */}
//               <Link to="/checkout">
//                 <div
//                   className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
//                 >
//                   <h1 className="text-[#fff] text-[18px] font-[600]">
//                     Checkout Now (USD${totalPrice})
//                   </h1>
//                 </div>
//               </Link>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
//   const [value, setValue] = useState(data.qty);
//   const totalPrice = data.discountPrice * value;

//   const increment = (data) => {
//     if (data.stock < value) {
//       toast.error("Product stock limited!");
//     } else {
//       setValue(value + 1);
//       const updateCartData = { ...data, qty: value + 1 };
//       quantityChangeHandler(updateCartData);
//     }
//   };

//   const decrement = (data) => {
//     setValue(value === 1 ? 1 : value - 1);
//     const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
//     quantityChangeHandler(updateCartData);
//   };

//   return (
//     <div className="border-b p-4">
//       <div className="w-full flex items-center">
//         <div>
//           <div
//             className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
//             onClick={() => increment(data)}
//           >
//             <HiPlus size={18} color="#fff" />
//           </div>
//           <span className="pl-[10px]">{data.qty}</span>
//           <div
//             className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
//             onClick={() => decrement(data)}
//           >
//             <HiOutlineMinus size={16} color="#7d879c" />
//           </div>
//         </div>
//         <img
//   src={data?.images?.[0]?.url || "https://via.placeholder.com/130"}
//   alt={data?.name || "Product Image"}
//   className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
// />
//         <div className="pl-[5px]">
//           <h1>{data.name}</h1>
//           <h4 className="font-[400] text-[15px] text-[#00000082]">
//             ${data.discountPrice} * {value}
//           </h4>
//           <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
//             US${totalPrice}
//           </h4>
//         </div>
//         <RxCross1
//           className="cursor-pointer"
//           onClick={() => removeFromCartHandler(data)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Cart;