import React, { useState } from 'react'
import LogoGBW from '../assets/images/logoGBW.png'
import { Link } from 'react-router-dom'
import { LuArrowRight } from 'react-icons/lu'
import AuthModal from '../pages/auth/AuthModal'

const Footer = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    const [authOpen, setAuthOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)

    
  return (
    <footer className="bg-green-900 relative mt-16 bottom-0">
        <svg
            className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-deep-purple-accent-400"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
        >
            <path
            fill="#0d542b"
            d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
            />
        </svg>

        <div className="container px-6 py-12 mx-auto">
            {!userId && 
                <>
                <div className="md:flex md:-mx-3 md:items-center md:justify-between">
                    <h1 className="text-xl font-semibold tracking-tight md:mx-3 xl:text-2xl text-ow">Start your green journey</h1>
                        <div className="mt-6 md:mx-3 shrink-0 md:mt-0 md:w-auto">
                            <button
                                className="inline-flex items-center justify-center font-medium w-full px-4 py-3  gap-x-3 pri-btn"
                                onClick={
                                    () => {
                                        setLoginOpen(false)
                                        setAuthOpen(true)
                                    }}
                            >
                                <span>Sign Up Now</span>
                                <LuArrowRight className='text-lg'/>
                            </button>
                        </div>
                </div>
                <hr className="my-6 border-gray-400 md:my-8"/>
                </>
            }

            <div className="grid grid-cols-2 gap-x-0 gap-y-6 sm:grid-cols-3">
                <div>
                    <p className="font-semibold text-ow">Quick Links</p>

                    <div className="flex flex-col items-start mt-5 space-y-2">
                        <Link to="/" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">Home</Link>
                        <Link to="/recycle" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">Recycle</Link>
                        <Link to="/shop" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">Shop</Link>
                    </div>
                </div>

                <div>
                    <p className="font-semibold  text-white">Support</p>

                    <div className="flex flex-col items-start mt-5 space-y-2">
                        <Link to="#" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">FAQs</Link>
                        <Link to="#" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">Terms & Conditions</Link>
                        <Link to="#" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">Privacy Policy</Link>
                    </div>
                </div>

                <div>
                    <p className="font-semibold  text-white">Contact Us</p>

                    <div className="flex flex-col items-start mt-5 space-y-2">
                        <Link to="#" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">+91 7899766787</Link>
                        <Link to="#" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">greenbin@gmail.com</Link>
                        <Link to="#" className=" transition-colors duration-300 text-gray-300 hover:text-lgg">Vempalli - 516330</Link>
                    </div>
                </div>
            </div>
            
            <hr className="my-6 border-gray-400 md:my-8 "/>
            
            <div className="flex flex-col items-center justify-between sm:flex-row">
                <Link to="#">
                    <img className="w-auto h-10" src={LogoGBW} alt=""/>
                </Link>

                <p className="mt-4 text-sm sm:mt-0 text-gray-300">© Copyright 2025. All Rights Reserved.</p>
            </div>
        </div>

        <AuthModal
        authOpen={authOpen}
        loginOpen={loginOpen}
        setLoginOpen={()=>setLoginOpen(prev => !prev)}
        onClose={() => setAuthOpen(prev => !prev)}
      />
    </footer>
    
  )
}

export default Footer