import React, { useState, useEffect } from "react";
import { FaRegStar, FaStar, FaStarHalfStroke } from "react-icons/fa6";
import { LuHeart } from "react-icons/lu";
import TrendingProductsCarousel from "../../components/TrendingProductsCarousel";
import Modal from "../../components/Modal";
import { PiCoinVerticalDuotone } from "react-icons/pi";
import { useParams } from "react-router-dom"; 
import products from "../../data/products"
import axios from "axios"; 

const ProductOverview = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [liked, setLiked] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [mainImage, setMainImage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);
        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
          setMainImage(fetchedProduct.images[0].imageUrl);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally{
        setIsLoading(false)
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if(!product) {
    return <div>No Product Found</div>
  }

  return (
    <>
      <section className="md:max-w-4xl lg:max-w-5xl mx-auto p-4 w-full">
        {/* Product Card */}
        <div className="bg-ow dark:bg-dsc p-0 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex flex-col lg:flex-row gap-4 max-w-lg m-auto">
              <div className="lg:order-2">
                <img
                  src={mainImage}
                  alt={product.name}
                  onClick={() => setOpenImage(true)}
                  className="w-full h-80 object-cover rounded-xl cursor-pointer"
                />

                <Modal open={openImage} onClose={() => setOpenImage(false)}>
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-80 object-cover rounded-xl"
                    />
                </Modal>
              </div>

              <div className="flex lg:flex-col justify-center gap-4 lg:order-1">
                {product.images.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 ">
                    <img
                      src={img.imageUrl}
                      alt={`thumb-${idx}`}
                      className={`w-full h-full object-cover rounded-md cursor-pointer ${
                        img.imageUrl === mainImage ? "ring-2 ring-lgg" : ""
                      }`}
                      onClick={() => setMainImage(img.imageUrl)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 flex flex-col justify-between">
              <h2 className="text-2xl font-semibold text-tc dark:text-ow">{product.pName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
              <p className="text-gray-700 break-words dark:text-gray-300">{product.description}</p>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold flex items-center text-lgg">
                  <PiCoinVerticalDuotone />{product.price}
                </span>
              </div>

              {/* Rating */}
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

                <span className="ml-2 flex items-center gap-2 text-sm">
                  <div className="text-gray-700 dark:text-gray-300">{product.rating}</div>
                  <div className="text-gray-500 dark:text-gray-400">({product.ratedCount})</div>
                </span>
              </div>

              {/* Stock */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stock:{" "}
                <span
                  className={
                    product.stock > 0 ? "text-lgg" : "text-red-600 dark:text-red-400"
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : "Out of stock"}
                </span>
              </p>

              {/* Button */}
              <div className="flex gap-4 items-center">
                <button
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-4 font-semibold ${
                      product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed rounded-lg"
                      : "pri-btn"
                  }`}
                  >
                  Add to Cart
                </button>

              <button
                  onClick={() => setLiked(!liked)}
                  className={`px-4 py-2 rounded-lg text-lgg border-lgg border-1 transition cursor-pointer hover:bg-green-100 dark:hover:bg-green-900`}
                  title={`${liked ? "Remove from wishlist":"Add to wishlist"}`}
                  >
                  <LuHeart className={`${liked ? "fill-green-500" : "fill-ow dark:fill-dsc"} text-xl`} />
              </button>
              </div>

            </div>
          </div>
        </div>

        {/* Features Section Outside Card */}
        <div className="mt-6 bg-neutral-200 dark:bg-dtc p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-tc dark:text-ow">Product Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-gray-700 dark:text-gray-300">
            {product.features.map((feature) => (
              <li key={feature.fId}>
                <span className="font-semibold capitalize">{feature.featureName}:</span> {feature.featureValue}
              </li>
            ))}
          </ul>
        </div>

      </section>

      
      {/* Similar Products */}
      <section className="mt-8 py-4 px-1 sm:px-4 xl:px-6 w-full bg-ow dark:bg-dsc">
          <div className="flex justify-between items-center mb-4 px-4 sm:mb-8">
            <h2 className="text-2xl font-semibold text-tc dark:text-ow">Similar <span className='text-lgg'>Products</span></h2> 
          </div>
          <TrendingProductsCarousel products={products} />
      </section>    

    </>
  );
};

export default ProductOverview;
