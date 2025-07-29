import React, { useEffect, useState } from 'react'
import TrendingProductsCarousel from '../components/TrendingProductsCarousel';
import missionImg from '../assets/images/missionImg.webp'
import { FaCartShopping, FaCoins, FaRecycle, FaUsers } from "react-icons/fa6";
import { TbLeaf, TbRecycle, TbUsersGroup, TbAward } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { LuChevronRight } from 'react-icons/lu';

const impactStats = [
  {label:"Plastic Recycled", value:"12300 kg", icon:TbRecycle},
  {label:"Co2 Saved", value:"34500 kg", icon:TbLeaf},
  {label:"Recyclers", value:"2000+", icon:TbUsersGroup},
  {label:"Top Recycler", value:"Charan", icon:TbAward}

]

const workingSteps = [
  {icon:FaUsers, heading:"Join the Movement", desc:"Create an account and log in to get started easily."},
  {icon:FaRecycle, heading:"Schedule a Pickup", desc:"Schedule a pickup and give your plastic a new purpose."},
  {icon:FaCoins, heading:"Earn Green Coins", desc:"Earn Green Coins based on the weight of plastic you contribute."},
  {icon:FaCartShopping, heading:"Shop Sustainably", desc:"Use your Green Coins to buy recycled products."}
]


const Home = () => {

  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch("http://localhost:8080/api/product/all")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/*hero section*/}
      <section className="relative overflow-hidden">
        <div className="relative  py-24 h-full w-full bg-lgg">

          <div className="absolute inset-0 bg-black opacity-20"></div>

          <div className="container mx-auto px-6 h-full flex items-center relative z-10">
            <div className="text-ow max-w-3xl">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-ow text-sm font-medium mb-4">
                Reduce. Recycle. Reuse
              </span>
              <h1 className="text-center sm:text-left text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">
                Turn Your Trash Into Treasure
              </h1>
              <p className="text-center sm:text-left text-base md:text-2xl mb-8 text-gray-100">
              Join us in building a greener future, every step towards recycling benefits both you and the planet!                  </p>
              <div className="w-full justify-between flex flex-col gap-4 sm:flex-row md:text-xl">
                <Link to='/recycle' className='w-full'>
                <button 
                  className="w-full white-btn px-8 py-3 font-semibold hover:text-tc">
                  Recycle Now
                </button>
                </Link>
            
                <Link to="/shop" className='w-full'>
                <button className="w-full white-trans-btn px-8 py-2.5 font-semibold hover:bg-white hover:text-lgg">
                  Shop Now
                </button>
                </Link>

              </div>
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute inset-y-0 right-0 w-[40%] pointer-events-none">
            <div className="absolute sm:w-[60vw] sm:h-[60vw] w-80 h-80 bg-green-400/20 rounded-full -bottom-[10%] -right-[50%] blur-[0]"></div> 
          </div>

        </div>
        {/* Wave */}
        <div className="absolute -bottom-0.5 sm:-bottom-8 left-0 -right-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path className="fill-ow dark:fill-dsc" fillOpacity="1" d="M0,224L80,229.3C160,235,320,245,480,245.3C640,245,800,235,960,224C1120,213,1280,203,1360,197.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
              
      </section>  

      {/* Trending section */}
      <section className="py-4 px-1 sm:px-4 xl:px-6 w-full bg-ow dark:bg-dsc">
  
          <div className="flex justify-between items-center mb-4 px-4 sm:mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-tc dark:text-ow">Trending <span className='text-lgg'>Products</span></h2> 
            <Link to="/shop">
              <button className='bg-gray-200 dark:bg-dtc text-sm px-3 py-2 text-tc cursor-pointer dark:text-ow rounded-full font-normal flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-black transition duration-300'>
                View all
                <LuChevronRight />
              </button>
              </Link>
          </div>

          <TrendingProductsCarousel products={products} />
    </section>
      {/* How it works section */} 
      <section className="bg-lgg py-12 sm:py-20 lg:py-28 relative">
                <div className="absolute -bottom-0.5 -left-0.5 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path className="fill-ow dark:fill-dsc" fillOpacity="1" d="M0,288L80,288C160,288,320,288,480,277.3C640,267,800,245,960,240C1120,235,1280,245,1360,250.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
        <div className="absolute -top-0.5 left-0 -right-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
            <path className="fill-ow dark:fill-dsc" fillOpacity="1" d="M0,288L80,288C160,288,320,288,480,277.3C640,267,800,245,960,240C1120,235,1280,245,1360,250.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>


        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-tc sm:text-4xl">
                  How Green Bin Works
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg font-normal text-ow lg:text-xl lg:leading-8">
                    Make a difference with us and start your journey in 4 steps
                </p>
            </div>
            <ul className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-10 sm:mt-16 lg:mt-20 lg:max-w-6xl lg:grid-cols-4">

              {workingSteps.map((step, index)=>(
                  <li key={index} className="flex-start group relative flex lg:flex-col">
                    {index !== workingSteps.length - 1 && (
                      <span
                        className="absolute left-[18px] top-14 h-[calc(100%_-_32px)] w-px bg-gray-300 lg:right-0 lg:left-auto lg:top-[18px] lg:h-px lg:w-[calc(100%_-_72px)]"
                        aria-hidden="true"
                      ></span>
                    )}
                    <div
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 transition-all duration-200 group-hover:border-gray-900 group-hover:bg-tc">
                        <step.icon className="h-5 w-5 text-lgd group-hover:text-ow"/>
                    </div>
                    <div className="ml-6 lg:ml-0 lg:mt-10">
                        <h3
                            className="text-xl font-bold text-tc before:mb-2 before:block before:text-sm before:text-gray-500">
                            {step.heading}
                        </h3>
                        <h4 className="mt-2 text-base text-ow">{step.desc}</h4>
                    </div>
                  </li>
              ))}

            </ul>
        </div>
      </section>

      {/* Statistics */}
      <section className="px-6 md:px-8 lg:px-16 py-8 sm:py-4 bg-ow dark:bg-dsc">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-tc dark:text-ow md:text-4xl">
            Our <span className='text-lgg'>Impact</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 py-8 md:py-12 text-tc dark:text-ow">
          {impactStats.map((stat, index)=>(
            <div key={index} className="flex items-center p-6 md:p-8 bg-[#e4e8e3] dark:bg-dtc shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-lgd dark:text-lgg bg-ow dark:bg-dsc rounded-full mr-6">
              <stat.icon className='w-6 h-6'/>
              </div>
              <div>
                <span className="block text-xl font-bold">{stat.value}</span>
                <span className="block text-gray-700 dark:text-gray-300">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission section */}
      <section className="w-full lg:pl-16 py-8 lg:py-16 bg-ow dark:bg-dsc">
        <div className="md:flex md:items-center">
          <div className="md:w-1/2 px-4">
            <h3 className="text-3xl font-semibold tracking-tight text-tc dark:text-ow md:text-4xl">
                Our <span className='text-lgg'>Mission</span>
            </h3>
            <p className="mt-6 text-gray-600 dark:text-gray-400">We’re on a mission to make plastic waste management smarter and more sustainable. Our platform connects communities with recycling services, rewarding users with Green Coins for eco-friendly actions. Together, we’re turning plastic waste into valuable products and building a cleaner, greener future.</p>
          </div>
          <div className="mt-8 md:w-1/2 md:px-4 lg:px-28 md:mt-0">
            <img className="object-cover w-full md:rounded-2xl h-72" src={missionImg} alt="Video thumbnail"/>
          </div>
        </div>
      </section>

     </>
  )
}

export default Home




