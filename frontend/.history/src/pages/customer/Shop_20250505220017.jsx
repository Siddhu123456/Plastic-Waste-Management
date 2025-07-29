import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LuArrowUpDown, LuSlidersHorizontal } from 'react-icons/lu';
import ProductCard from '../../components/ProductCard';
import FilterBar from '../../components/FilterBar';

const Shop = () => {

  const [filterOpen, setFilterOpen] = useState(false)
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("http://localhost:8080/api/product/all")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);
  

  const [filters, setFilters] = useState({
    categories:[],
    inStockOnly: false,
    minRating: 0,
    discountOnly: false,
    priceRange: [0,2000]
  });


  const updateFilter = (key, value) => {
    setFilters(prev => ({...prev,[key]:value}));
  };


  const [sortOption, setSortOption] = useState('Popularity');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const handleSortChange = (sortKey) => {
    setSortOption(sortKey);
    setIsSortOpen(false);
  };

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const inCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
      const inStock = !filters.inStockOnly || product.stock;
      const meetsRating = product.rating >= filters.minRating;
      const hasDiscount = !filters.discountOnly || product.discount > 0;
      const inPriceRange = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
  
      return inCategory && inStock && meetsRating && hasDiscount && inPriceRange;
    });
  }, [products, filters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortOption) {
      case 'Newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'Rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'Discount':
        sorted.sort((a, b) => b.discount - a.discount);
        break;
      case 'Cost Low to High':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'Cost High to Low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'Popularity':
      default:
        const C = 3.5; // average rating across all products
        const m = 10;  // minimum votes for full trust

        sorted.sort((a, b) => {
          const scoreA = ((a.ratedCount / (a.ratedCount + m)) * a.rating) + ((m / (a.ratedCount + m)) * C);
          const scoreB = ((b.ratedCount / (b.ratedCount + m)) * b.rating) + ((m / (b.ratedCount + m)) * C);
          return scoreB - scoreA;
        });
        break;
    }
  
    return sorted;
  }, [filteredProducts, sortOption]);
  

  return (
    <>

      {/* Filtering and Sorting */}
      <section className='bg-ow sticky top-13 py-3 z-40 dark:bg-dsc text-gray-800 dark:text-neutral-200'>
        <div className='flex justify-between px-4 md:px-8 text-sm flex-wrap gap-y-2'>
          <div
            onClick={()=>setFilterOpen(true)} 
            className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar cursor-pointer hover:text-lgg"
          >
            <div>
              <LuSlidersHorizontal />
            </div>
            Filters
          </div>

          <div className="flex items-center relative" ref={sortRef}>
            <p className='px-3 text-gray-600 dark:text-neutral-400'>{sortedProducts.length} results</p>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1 border-l-2 pl-3 border-gray-400 cursor-pointer hover:text-lgg"
            >
              {sortOption}
              <LuArrowUpDown />
            </button>

            {isSortOpen && (
                <ul className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-dtc border border-neutral-300 dark:border-neutral-700 rounded-md shadow-lg text-sm w-52">
                  {[
                    { label: 'Popularity', key: 'Popularity' },
                    { label: 'Newest', key: 'Newest' },
                    { label: 'Rating', key: 'Rating' },
                    {label: 'Discount', key:'Discount'},
                    { label: 'Cost Low to High', key: 'Cost Low to High' },
                    { label: 'Cost High to Low', key: 'Cost High to Low' }
                  ].map(({ label, key }) => (
                    <li
                      key={key}
                      className={`px-4 py-2 cursor-pointer ${
                        sortOption === key ? 'bg-lgg text-white dark:text-black font-semibold' : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                      onClick={() => handleSortChange(key)}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
            )}

          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className='bg-ow dark:bg-dsc'>
        {sortedProducts.length?
          <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
                      py-4 px-1 sm:px-4 xl:px-6
                      gap-x-0.5 gap-y-1 sm:gap-3 md:gap-3.5 xl:gap-3">
            {sortedProducts.map(product =>
              <ProductCard 
                key={product.pId}
                product={product}
              />
            )}
          </div>:
          <div className='text-center p-6 text-2xl text-lgg'>
            No Products Found
          </div>
          }
      </section>

      <FilterBar 
        isOpen={filterOpen}
        filters = {filters}
        updateFilter={updateFilter}
        onClose={()=>setFilterOpen(false)}
      />

    </>
  );
};

export default Shop;
