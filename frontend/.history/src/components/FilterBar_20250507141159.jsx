import React, { useState } from 'react';
import { LuCircle, LuStar, LuX } from 'react-icons/lu';

const FilterBar = ({isOpen, filters, updateFilter, onClose }) => {
  const ratingOptions = [1, 2, 3, 4, 5]

  const handleCategoryToggle = (category) => {
    const updated = filters.categories.includes(category)
                    ?filters.categories.filter(c => c !== category)
                    :[...filters.categories, category]
    updateFilter('categories', updated)
  }

  return (
    <div
      className={`
        fixed inset-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
        <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div 
            className={`
                absolute left-0 h-full w-64 text-tc dark:text-ow bg-ow dark:bg-dsc shadow-lg overflow-y-auto
                transition-opacity duration-500 text-sm
                ${isOpen ? 'opacity-100' : 'opacity-0'}
            `}
        >

            <div className="flex justify-between items-center p-2 py-4 border-b border-gray-300">
                <h2 className="font-semibold text-base">Filters</h2>
                <button onClick={onClose} className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5 rounded-md dark:text-ow active:text-lgg">
                    <LuX className="text-xl" />
                </button>
            </div>

        {/* Category Filter */}
        <div className="px-6">
            <h3 className="font-bold py-2">Category</h3>
            {['households', 'kitchen', 'Stationery', 'Toys'].map((cat) => (
            <label key={cat} className="block mb-1">
                <input
                    type="checkbox"
                    value={cat}
                    checked={filters.categories.includes(cat)}
                    onChange={() => handleCategoryToggle( cat)}
                    className="mr-2 accent-lgg"
                />
                {cat}
            </label>
            ))}
        </div>

        {/* In Stock Filter */}
        <div className="px-6">
            <h3 className="font-bold py-2">Availability</h3>
            <label className="block mb-1">
                <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={() => updateFilter('inStockOnly', !filters.inStockOnly)}
                className="mr-2 accent-lgg"
                />
                Only In Stock
            </label>
        </div>


        {/* Rating Filter */}
        <div className="px-6">
            <h3 className="font-bold py-2">Rating</h3>
            {[0,1,2,3,4,5].map((rating) => (
            <label key={rating} className="flex items-center mb-1">
                <LuCircle className={`${filters.minRating == rating ? 'fill-lgg text-lgg':''}`}/>
                <input
                type="radio"
                value={rating}
                checked={filters.minRating === rating}
                onChange={() => updateFilter('minRating', rating)}
                className="mr-2 appearance-none"
                />
                <div className="flex text-tcc">
                {rating === 0 ?
                 'All'
                :<>{Array(rating)
                    .fill(0)
                    .map((_, i) => (
                    <LuStar className='fill-tc dark:fill-ow' key={i} />
                    ))}
                    <p className='ml-1'>& up</p>
                </>
                }
                </div>
            </label>
            ))}
        </div>

        </div>
    </div>
  );
};

export default FilterBar;
