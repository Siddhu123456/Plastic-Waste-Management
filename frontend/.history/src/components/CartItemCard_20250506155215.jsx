import React from 'react'
import { Link } from 'react-router-dom'
import {LuPlus, LuMinus, LuTrash2} from 'react-icons/lu'
import { PiCoinVerticalDuotone } from "react-icons/pi";


const CartItemCard = ({item, removeItem, modifyQty, setOutStock}) => {
    console.log(setOutStock())
    const primaryImage = item.product.images.find(img => img.primary) || product.images[0];

    if(item.product.stock < item.quantity){
        setOutStock(true)
    } 

  return (

    <div className="flex gap-4 py-4 sm:p-4 border-t border-neutral-300 dark:border-neutral-500">
        <div className="flex gap-4">
            <Link to={`/product/${item.product.pId}`} className="w-28 h-28 max-sm:w-20 max-sm:h-20 shrink-0">
            <img src={primaryImage.imageUrl} className="w-full h-full object-cover rounded-sm" />
            </Link>

            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-sm sm:text-base font-semibold text-tc dark:text-ow">{item.product.pName}</h3>
                    <p className="text-sm font-semibold text-neutral-400 mt-2 flex items-center gap-2">Price: <span className="text-tc dark:text-ow flex items-center"><PiCoinVerticalDuotone /> {item.product.price}</span></p>
                </div>
                <div className="text-red-400 text-xs">
                    {item.product.stock === 0 ? 'out of stock':
                    item.product.stock < item.quantity ? 
                        'only '+item.product.stock+' available':
                            item.product.stock+' left'
                    }
                </div>
                <div className="mt-auto flex items-center gap-3">
                    <button type="button"
                    onClick={()=>modifyQty(item.product.pId, item.quantity-1)}
                    className="flex items-center justify-center w-5 h-5 cursor-pointer bg-neutral-400 outline-none rounded-full text-white">
                    <LuMinus />
                    </button>
                    <span className="font-semibold text-sm leading-[18px] text-tc dark:text-ow">{item.quantity}</span>
                    <button type="button"
                    onClick={()=>modifyQty(item.product.pId, item.quantity+1)}
                    className="flex items-center justify-center w-5 h-5 cursor-pointer bg-neutral-800 outline-none rounded-full text-white">
                    <LuPlus />
                    </button>
                </div>
            </div>
        </div>
        <div className="ml-auto flex flex-col">
            <div className="flex items-start gap-4 justify-end">
            <LuTrash2
                onClick={()=>removeItem(item.product.pId)}
             className="text-lg cursor-pointer text-neutral-400 hover:text-red-600 inline-block" />
            </div>
            <h3 className="text-sm flex items-center sm:text-base font-semibold text-tc dark:text-ow mt-auto"><PiCoinVerticalDuotone />{item.quantity * item.product.price}</h3>
        </div>
    </div>
  )
}

export default CartItemCard