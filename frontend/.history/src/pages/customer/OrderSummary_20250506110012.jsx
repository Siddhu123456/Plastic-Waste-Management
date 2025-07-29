import React, { useEffect, useState } from 'react';
import { FaCheck, FaMotorcycle, FaTruckFast, FaCartShopping } from "react-icons/fa6";
import { PiCalendarCheck, PiCoinVerticalDuotone, PiMapPin, PiTruckTrailer } from 'react-icons/pi';
import OrderItemCard from '../../components/OrderItemCard';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderSummary = () => {
/*
    const order = {
        id: "ORD-001",
        date: "2025-04-20",
        deliveredOn: null,
        status: "shipped",
        items: [
          {
            id:1,
            name: "Premium Headphones",
            quantity: 1,
            total: 80,
            image: "https://readymadeui.com/images/watch5.webp",
          },
          {
            id:2,
            name: "USB-C Cable",
            quantity: 2,
            total: 40,
            image: "https://readymadeui.com/images/sunglass6.webp",
          },
        ],
        address: {
            name: "John Smith",
            street: "123 Main Street",
            city: "San Francisco",
            state: "CA",
            zip: "94105",
            phone:"+91 7867390782"
          },
        subTotal: 120,
      };*/
        const { id } = useParams(); 
        const [order, setOrder] = useState(null);
    const steps = ['ordered', 'shipped', 'out for delivery', 'delivered'];

        useEffect(() => {
          const fetchOrder = async () => {
            try {
              const response = await axios.get(`http://localhost:8080/api/orders/${id}`);
              setOrder(response.data);
            } catch (error) {
              console.error("Error fetching order:", error);
            }
          };
      
          if(id) fetchOrder();
        }, [id]);

        const currentStepIndex =order ? steps.findIndex(step => step === order.status): 0;

        console.log(order)
  const progressIcons = [<FaCartShopping />, <FaTruckFast />, <FaMotorcycle />, <FaCheck />];

  // Format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order.orderDate);
    const estDate = new Date(orderDate);
    estDate.setDate(orderDate.getDate() + 5);
  
    return (
      <>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Estimated Delivery</p>
        <p className="font-medium">{formatDate(estDate)}</p>
      </>
    );
  };
  
  if(!order) return "Loading";

  return (


    <section className="max-w-5xl mx-auto p-2 py-4 sm:p-4">

        <div>
          <h1 className="text-xl sm:text-2xl text-center font-semibold text-tc dark:text-ow">
            Order Details - ORD - {order.id}
          </h1>
        </div>

        {/* Progress Tracker */}
        <div className="flex flex-row justify-between items-center relative py-6 sm:p-8">
            {steps.map((label, index) => {
                const completed = index <= currentStepIndex;
                return (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                    {/* Circle */}
                    <div className="relative z-10">
                    <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-base sm:text-lg
                        ${completed ? 'bg-lgg text-white' : 'bg-neutral-400 text-white'}`}
                    >
                        <span className="text-base">{progressIcons[index]}</span>
                    </div>
                    </div>

                    {/* Label */}
                    <p
                    className={`mt-2 sm:mt-3 text-sm font-medium capitalize truncate w-full text-center ${
                        completed ? 'text-tc dark:text-ow' : 'text-gray-400'
                    }`}
                    >
                    {label}
                    </p>

                    {/* Line to next step */}
                    {index !== steps.length - 1 && (
                    <div className="absolute top-3 sm:top-4 left-1/2 w-full h-1">
                        <div className="h-1 bg-gray-300 w-full relative">
                        <div
                            className={`absolute top-0 left-0 h-1 ${
                            index < currentStepIndex ? 'bg-lgg' : 'bg-neutral-400'
                            }`}
                            style={{ width: '100%' }}
                        />
                        </div>
                    </div>
                    )}
                </div>
                );
            })}
        </div>

        <div className="bg-white dark:bg-dtc rounded-md p-3 sm:p-6 border border-neutral-200 dark:border-neutral-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center text-tc dark:text-ow">
                <div className="flex flex-col justify-center ">
                    <div className="flex items-center gap-2 mb-4">
                        <PiCalendarCheck className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                        <div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Ordered On</p>
                            <p className="font-medium">{formatDate(order.orderDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <PiTruckTrailer className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                        {order.deliveredOn ? (
                        <div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Delivered On</p>
                            <p className="font-medium">
                            {formatDate(order.deliveredOn)}
                            </p>
                        </div>):
                        <div>
                            {getEstimatedDelivery()}
                        </div>
                        }
                    </div>

                </div>
                <div className="flex flex-col justify-center">
                    <div className='flex items-center gap-2 font-medium'>
                        <PiMapPin className='w-5 h-5 text-neutral-500 dark:text-neutral-400' />
                        <p className="text-sm text-neutral-400">Shipping Address</p>
                    </div>
                    <div className="space-y-1 pl-7">
                        <p className="text-lg font-semibold text-tc dark:text-white">
                            {order.address}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">{order.address.street}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">
                            {order.address.city}, {order.address.state} - {order.address.zip}
                        </p>
                        <p className="text-sm text-tc dark:text-neutral-300">
                            Phone: <span className='font-semibold'>{order.address.phone}</span>
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
        <div className="bg-white dark:bg-dtc rounded-md p-3 mt-3 sm:mt-6 sm:p-6 border border-neutral-200 dark:border-neutral-600">
            <h1 className="text-xl font-semibold text-lgd dark:text-lgg p-2">Order Items</h1>
            <div className="flex flex-col gap-8">
                <div>
                    {order.items.map(item => 
                    <OrderItemCard key={item.id} item={item} />
                    )}
                </div>
            </div>
            <div className="flex justify-between p-4 text-lg">
                <h1 className="font-semibold text-tc dark:text-ow">Sub Total</h1>
                <div className="flex items-center gap-1  text-lgd dark:text-lgg">
                    <PiCoinVerticalDuotone />
                    <p className="font-semibold">{order.subTotal}</p>
                </div>
            </div>
        </div> 
    </section>
  );
};

export default OrderSummary;