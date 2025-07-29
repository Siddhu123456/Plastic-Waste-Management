import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from './ProductCard';
import {  LuChevronsLeft, LuChevronsRight } from 'react-icons/lu';

const TrendingProductsCarousel = ({products}) => {
  const swiperRef = useRef(null);

  return (

        <>
        <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay]}
            spaceBetween={2}
            loop={true}
            slidesPerView={2}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
            640:{slidesPerView: 3,spaceBetween: 10},
            768: { slidesPerView: 3,spaceBetween: 15 },
            1024: { slidesPerView: 4,spaceBetween: 15 },
            1280: { slidesPerView: 5,spaceBetween: 10 }

            }}
        >
            {products.map((product) => (
            <SwiperSlide key={product.id}>
                <ProductCard product={product} />
            </SwiperSlide>
            ))}
        </Swiper>
        <div className="flex items-center justify-center mt-2">
        <div className="flex gap-8 dark:text-ow">
                <button 
                    onClick={() => swiperRef.current.swiper.slidePrev()}
                    className="p-2 rounded-full border-lgg border hover:bg-lgg hover:text-ow transition-all duration-300"
                    aria-label="Previous slide"
                >
                    <LuChevronsLeft className="text-xl" />
                </button>
                <button 
                    onClick={() => swiperRef.current.swiper.slideNext()}
                    className="p-2 rounded-full border-lgg border hover:bg-lgg hover:text-ow transition-all duration-300"
                    aria-label="Next slide"
                >
                    <LuChevronsRight className="text-xl" />
                </button>
            </div>
        </div>
        </>
  );
};

export default TrendingProductsCarousel;
