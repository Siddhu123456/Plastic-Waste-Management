import React, { useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'

const Login = ({setLoginOpen, setIsPasswordForgot}) => {

  const [isPasswordHidden, setPasswordHidden] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")


  return (
    <div className="p-4 sm:p-8">
      <div className="text-center">
        <h1 className="block text-2xl font-semibold text-tc dark:text-ow">Sign in</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-neutral-300">
          New to Green Bin?
          <a className="text-lgg cursor-pointer decoration-1 ml-1 hover:underline focus:outline-hidden focus:underline font-medium"
            onClick={setLoginOpen}
          >
             Sign up here
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
            </div>

            <div>
              <div className="flex flex-wrap justify-between items-center gap-2">
                <label htmlFor="password" className="block mb-1 text-tc dark:text-white">Password</label>
                <a className="inline-flex cursor-pointer items-center gap-x-1 text-sm dark:text-neutral-400 text-neutral-500 hover:text-lgg font-medium"
                  onClick={setIsPasswordForgot}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input type={isPasswordHidden ? "password" : "text"} id="password" name="password"
                  placeholder='••••••••'
                  className="py-2 px-4 block w-full text-tc dark:text-neutral-200 border-gray-400 border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700" 
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              
                <button type='button' className="text-gray-400 absolute cursor-pointer right-3 text-xl inset-y-0 my-auto active:text-lgg"
                      onClick={() => setPasswordHidden(!isPasswordHidden)}
                  >
                      {
                          isPasswordHidden ? (<LuEye />) : (<LuEyeOff />)
                      }
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
            <button type="submit" className="w-full mt-2 py-2.5 px-4 text-lg font-medium pri-btn focus:outline-hidden focus:bg-lgd disabled:opacity-50 disabled:pointer-events-none">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login