import React from 'react'
import { Link } from 'react-router-dom'
import { PiCoinVerticalDuotone } from "react-icons/pi";


const OrderItemCard = ({item}) => {
  return (
    <div className="flex gap-4 py-4 sm:p-4 border-b border-neutral-300 dark:border-neutral-500">
        <div className="flex gap-4 sm:gap-8">
            <Link to={`/product/${item.id}`} className="w-20 h-20 max-sm:w-20 max-sm:h-20 shrink-0">
            <img src={item.image} className="w-full h-full object-cover rounded-sm" />
            </Link>

            <div className="flex flex-col justify-center gap-1">
                <div>
                    <h3 className="text-sm sm:text-base font-semibold text-tc dark:text-ow">{item.name}</h3>
                </div>

                <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Quantity: {item.quantity}</p>
                </div>
            </div>
        </div>
        <div className="ml-auto flex flex-col justify-center">
            
            <h3 className="text-sm flex items-center sm:text-base font-semibold text-tc dark:text-ow"><PiCoinVerticalDuotone />{item.total}</h3>
        </div>
    </div>
  )
}

export default OrderItemCard