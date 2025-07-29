import React, { useState } from 'react'

const ForgotPassword = ({setIsPasswordForgot}) => {
    const [email, setEmail] = useState("")
  return (
    <div className="p-4 sm:p-8">
      <div className="text-center">
        <h1 className="block text-2xl font-semibold text-tc dark:text-ow">Forgot Password?</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-neutral-300">
          Remember your password?
          <a className="text-lgg cursor-pointer decoration-1 ml-1 hover:underline focus:outline-hidden focus:underline font-medium"
            onClick={()=>{
                setIsPasswordForgot(false)
            }}
          >
             Sign in here
          </a>
        </p>
      </div>
  
      <div className="mt-5">  
        <form>
          <div className="flex flex-col gap-y-2 sm:gap-y-4">

            <div>
              <label htmlFor="email" className="block mb-1 text-tc dark:text-white">Email</label>
              <div className="relative">
                <input type="email" id="email" name="email"
                  placeholder='abc123@gmail.com'
                  className="py-2 px-4 block w-full text-tc dark:text-neutral-200 border-gray-400 border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  required 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                Please include a valid email address
              </p>
            </div>

            <button type="submit" className="w-full mt-2 py-2.5 px-4 text-lg font-medium pri-btn focus:outline-hidden focus:bg-lgd disabled:opacity-50 disabled:pointer-events-none">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword