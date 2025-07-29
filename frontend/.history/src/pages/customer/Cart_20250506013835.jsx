import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { PiCoinVerticalDuotone, PiMapPinFill, PiPlusCircle } from "react-icons/pi";
import { FaOpencart } from "react-icons/fa6";
import CartItemCard from '../../components/CartItemCard';
import axios from 'axios';

const cart = [
  {id:1,name:'Golden Watch',price:100,quantity:3,total:300,image:"https://media.istockphoto.com/id/2204825940/photo/wireless-headphone.jpg?s=612x612&w=0&k=20&c=4XHfdkc95X-a3mB-M7ZAlJmMSH4_5LoIRUOzbvwWorI="},
  {id:2,name:'Smart Watch',price:50,quantity:1,total:50,image:'https://readymadeui.com/images/watch5.webp'},
  {id:3,name:'Round Glass',price:40,quantity:2,total:80,image:'https://readymadeui.com/images/sunglass6.webp'}
]

const Cart = () => {

    const [selectedAddress, setSelectedAddress] = useState(null);
  
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const [cart, setCart] = useState([]);

    useEffect(() => {
      const fetchCart = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/cart/${userId}`);
          setCart(response.data);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      };
    
      if (userId) {
        fetchCart();
      }
    }, [userId]);
     
    console.log(cart)

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

  const subTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const minOrderVal = 200;
  return (
    <>
        {cart.length ?
          <section className='grid grid-cols-12 gap-4 p-2 sm:p-4'>
            <div className="col-span-12 lg:col-span-7 bg-white dark:bg-dtc rounded-md p-4 sm:p-6">
              <h1 className="text-xl font-semibold text-lgd dark:text-lgg p-2">Shopping Cart</h1>

              <div className="flex flex-col gap-8">
                <div className="space-y-0">
                  {cart.map(item => 
                    <CartItemCard key={item.id} item={item} />
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
                {subTotal < minOrderVal && <p className="text-right text-red-500">Minimum Order Value {minOrderVal}</p>}
                <button type="button" disabled={subTotal < minOrderVal} className="disabled:bg-neutral-500 disabled:cursor-not-allowed px-4 py-2.5 w-full font-semibold tracking-wide pri-btn">
                  Buy Now
                </button>
                <Link to="/shop">
                <button type="button" className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 text-tc dark:text-ow border border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer">Back to Shop</button>
                </Link>
              </div>
            </div>      
          </section>:
          <section>
            <div class="flex flex-col items-center justify-center py-24">
              <FaOpencart className='text-7xl sm:text-9xl text-lgg' />
              <p class="text-neutral-500 dark:text-neutral-300 text-lg font-medium mb-4">Your shopping cart is empty.</p>
              <button
                class="px-6 py-2 pri-btn shadow-md">
                Let's go shopping!
              </button>
            </div>
          </section>
      }
    </>
  )
}

export default Cart