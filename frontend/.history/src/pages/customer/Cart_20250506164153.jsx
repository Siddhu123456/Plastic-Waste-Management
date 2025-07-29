import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { PiCoinVerticalDuotone, PiMapPinFill, PiPlusCircle } from "react-icons/pi";
import { FaOpencart } from "react-icons/fa6";
import CartItemCard from '../../components/CartItemCard';
import axios from 'axios';
import { useCart } from '../../components/CartContext';


const Cart = () => {

    const [selectedAddress, setSelectedAddress] = useState(null);
  
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const [cart, setCart] = useState([]);
    const { setCartCount } = useCart();
    const [loading, setLoading] = useState(false)
  

    const [balance, setBalance] = useState(0);

    const fetchTrans = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/transactions/user/${userId}`);
        const transactions = response.data;
        const totalEarned = transactions.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0);
        const totalSpent = transactions.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + tx.amount, 0);
        setBalance(totalEarned-totalSpent)
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
  
    useEffect(() => {
      if (userId) {
        fetchTrans();
      }
    }, [userId]);


    const handlePlaceOrder = async () => {
      if (!userId || !selectedAddress) return;
    
      try {
        const payload = {
          customer: userId,
          address: selectedAddress.id,
          items: cart.map(item => ({
            product: { pId: item.product.pId },
            quantity: item.quantity
          }))
        };
    
        const res = await axios.post("http://localhost:8080/api/orders/create", payload);
        alert(`Order placed successfully!`);
    
        // Clear cart
        await axios.delete("http://localhost:8080/api/cart/clear", {
          params: { userId }
        });
    
        setCart([]);    
        setCartCount(0);  
      } catch (err) {
        console.error(err);
        alert("Failed to place order.");
      }
    };
    


    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/cart/${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }finally{
        setLoading(false);
      }
    };
  
    useEffect(() => {
      if (userId) {
        fetchCart();
      }
    }, [userId]);
  
    const removeItem = async (productId) => {
      try {
        await axios.delete(`http://localhost:8080/api/cart/remove`, {
          params: {
            userId,
            productId,
          },
        })
        const res = await axios.get("http://localhost:8080/api/cart/count", { params: { userId } });
        setCartCount(res.data);
        await fetchCart(); 
      } catch (error) {
        console.error("Remove from cart failed:", error);
        alert("Something went wrong while removing from cart.");
      }
    };

    const modifyQty = async (productId, quantity) => {
      if(quantity <= 0) quantity = 1
      else if(quantity > 10) quantity = 10
      try {
        await axios.post(`http://localhost:8080/api/cart/add`, null, {
          params: {
            userId,
            productId,
            quantity,
          },
        });
        await fetchCart()
      } catch (error) {
        console.error("Modifying Quantity failed:", error);
        alert("Something went wrong while modifying quantity.");
      }
    };

    useEffect(() => {
      // Simulate fetch call
      const allAddresses = [
        {
          id: 1,
          name: "John Doe",
          street: "123 Eco Street",
          city: "GreenCity",
          state: "RecycleLand",
          zip: "456789",
          phone: "+91 9876543210",
          isDefault: true
        },
        {
          id: 2,
          name: "Jane Smith",
          street: "456 Green Ave",
          city: "CleanTown",
          state: "EcoState",
          zip: "654321",
          phone: "+91 8765432109",
          isDefault: false
        }
      ];
    
      const defaultAddress = allAddresses.find(addr => addr.isDefault) || allAddresses[0];
      setSelectedAddress(defaultAddress);
    }, []);

  const subTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const minOrderVal = 200;

  const outOfStock = cart.some(item => item.product.stock < item.quantity);

    if(loading)
      return (
      <div className="flex justify-center pt-20 w-full"><Loader/></div>
      )

  return (
    <>
        {cart.length ?
          <section className='grid grid-cols-12 gap-4 p-2 sm:p-4'>
            <div className="col-span-12 lg:col-span-7 bg-white dark:bg-dtc rounded-md p-4 sm:p-6">
              <h1 className="text-xl font-semibold text-lgd dark:text-lgg p-2">Shopping Cart</h1>

              <div className="flex flex-col gap-8">
                <div className="space-y-0">
                  {cart.map(item => 
                    <CartItemCard 
                      key={item.id} 
                      item={item} 
                      removeItem={removeItem} 
                      modifyQty={modifyQty}
                    />
                  )}
                </div>
              </div>
            </div>  
              {/* Summary */}
            <div className="bg-white dark:bg-dtc rounded-md col-span-12 lg:col-span-5 p-4 sm:p-6 h-max">
              <h1 className="text-xl font-semibold text-lgd dark:text-lgg border-b border-neutral-300 dark:border-neutral-500 p-2">Order Summary</h1>

              <div className="flex flex-wrap gap-4 font-semibold text-tc dark:text-ow p-2">
                Total <span className="ml-auto text-lg flex items-center"><PiCoinVerticalDuotone />{subTotal}</span>
              </div>
              {/* Address */}
              <div>
                <div className='flex items-center gap-2 pt-4 pb-2 font-medium'>
                  <PiMapPinFill className='text-lgg' />
                  <h2 className='text-neutral-700 dark:text-neutral-300'>Deliver To</h2>
                  <button className='ml-auto font-normal cursor-pointer text-lgd dark:text-lgg hover:underline text-sm pr-4'>change</button>
                </div>


                {selectedAddress ?
                  <div className="bg-ow dark:bg-dsc p-4 rounded-md">
                  <div className="pl-8 space-y-1">
                    <p className="text-lg font-semibold text-tc dark:text-white">
                      {selectedAddress.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{selectedAddress.street}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}
                    </p>
                    <p className="text-sm text-tc dark:text-neutral-300">
                      Phone: <span className='font-semibold'>{selectedAddress.phone}</span>
                    </p>
                  </div>
                  </div>:
                  <div className="text-center">
                    <button type="button" className="inline-flex items-center hover:underline group py-1 gap-1 cursor-pointer text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    <PiPlusCircle className="text-lg group-hover:text-lgg" />
                    Add Address
                    </button>
                  </div>
                }
              </div>


              <div className="mt-6 space-y-2">
                {outOfStock && <p className="text-right text-red-500 text-sm">Items in the card exceed stock. Please remove.</p>}
                {subTotal < minOrderVal && <p className="text-right text-red-500 text-sm">Minimum Order Value {minOrderVal}</p>}
                {subTotal > balance && <p className="text-right text-red-500 text-sm">Insufficient Coins {balance}</p>}

                <button 
                type="button" disabled={outOfStock || subTotal < minOrderVal || balance < subTotal} 
                onClick={handlePlaceOrder}
                className="disabled:bg-neutral-500 disabled:cursor-not-allowed px-4 py-2.5 w-full font-semibold tracking-wide pri-btn">
                  Buy Now
                </button>
                <Link to="/shop">
                <button type="button" className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 text-tc dark:text-ow border border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer">Back to Shop</button>
                </Link>
              </div>
            </div>      
          </section>:
          <section>
            <div className="flex flex-col items-center justify-center py-24">
              <FaOpencart className='text-7xl sm:text-9xl text-lgg' />
              <p className="text-neutral-500 dark:text-neutral-300 text-lg font-medium mb-4">Your shopping cart is empty.</p>
              <Link to='/shop'>
                <button
                  className="px-6 py-2 pri-btn shadow-md">
                  Let's go shopping!
                </button>
              </Link>

            </div>
          </section>
      }
    </>
  )
}

export default Cart