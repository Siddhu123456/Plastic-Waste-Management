import React from 'react';
import { LuHeart } from 'react-icons/lu';
import { FaRegStar, FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { PiCoinVerticalDuotone } from "react-icons/pi";
import { Link } from 'react-router-dom';



// Main product card component with props
const ProductCard = ({product}) => {

  const primaryImage = product.images.find(img => img.primary) || product.images[0];

  return (
    <Link to={`/product/${product.pId}`}>
    <div className="bg-white dark:bg-dtc rounded-xl overflow-hidden transition-all duration-300 transform group h-full flex flex-col cursor-pointer">
      <div className="relative overflow-hidden rounded-xl">
        <img 
          src={primaryImage.imageUrl} 
          alt={product.pName} 
          className="w-full md:h-64 h-48 object-cover object-center rounded-xl transition-transform ease-in-out duration-300 group-hover:scale-105"
        />
        <div className="absolute top-0 right-0 p-2 transition-opacity duration-300">
          <button 
            onClick={(e)=>{
              e.preventDefault()
              e.stopPropagation()
            }}
            className="bg-white dark:bg-dtc flex items-center justify-center p-1 sm:p-1.5 rounded-full shadow-md transition-colors duration-300 cursor-pointer group/heart"
            aria-label="Add to wishlist"
          >
            <LuHeart className='text-lgg group-hover/heart:fill-lgg'/>
          </button>
        </div>
        {
          product.stock === 0 ?
            <div className="absolute top-2 left-2 bg-lgd text-ow text-xs font-semibold px-2 py-1 rounded">
              out of stock
            </div>:
            product.discount ?
              <div className="absolute top-2 left-2 bg-lgd text-ow text-xs font-semibold px-2 py-1 rounded">
              {product.discount}% OFF
              </div>:''
        }
      </div>
      
      <div className="p-2 py-4 flex-grow justify-between flex flex-col gap-1 sm:gap-2 text-sm">
        <div className="flex items-center">
        <div className="flex text-lgg">
          {[...Array(5)].map((_, i) => {
            const diff = product.rating - i;

            if (diff >= 1) {
              return <FaStar key={i} />;
            } else if (diff >= 0.5) {
              return <FaStarHalfStroke key={i} />;
            } else {
              return <FaRegStar key={i} />;
            }
          })}
        </div>

          <span className="text-gray-500 dark:text-gray-300 text-xs ml-2">({product.ratedCount})</span>
        </div>
        
        <h3 className="font-medium sm:text-base text-tc dark:text-ow">{product.pName}</h3>
        
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="flex items-center sm:text-base font-bold text-lgg"><PiCoinVerticalDuotone />{product.price}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-300">{product.stock} left</span>
          </div>
      
      </div>
    </div>
    </Link>
  );
};


export default React.memo(ProductCard);