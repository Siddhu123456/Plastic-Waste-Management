import React, { useState } from 'react'
import Modal from '../../components/Modal'
import TermsAndConditions from '../../components/TermsAndConditions'

const Signup = ({setLoginOpen}) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsModalOpen, setTermsModalOpen] = useState(false)

  
  return (
    <div className="p-4 sm:p-8">
      <div className="text-center">
        <h1 className="block text-2xl font-semibold text-tc dark:text-ow">Sign up</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-neutral-300">
          Already have an account?
          <a className="text-lgg decoration-1 cursor-pointer ml-1 hover:underline focus:outline-hidden focus:underline font-medium"
            onClick={setLoginOpen}
          >
             Sign in here
          </a>
        </p>
      </div>
  
      <div className="mt-5">  
        <form>
          <div className="flex flex-col gap-y-2 sm:gap-y-3">

            <div>
              <label htmlFor="email" className="block mb-1 text-tc text-sm dark:text-white">Email</label>
              <div className="relative">
                <input type="email" id="email" name="email"
                  placeholder='abc123@gmail.com'
                  className="py-2 px-4 block w-full text-tc dark:text-neutral-200 border-gray-400 border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  required 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                Please include a valid email address so we can get back to you
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block mb-1 text-tc text-sm dark:text-white">Name</label>
              <div className="relative">
                <input type="name" id="name" name="name"
                  placeholder='valid name'
                  className="py-2 px-4 block w-full text-tc dark:text-neutral-200 border-gray-400 border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  required 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                Please include a valid email address so we can get back to you
              </p>
            </div>

            <div>
                <label htmlFor="password" className="block mb-1 text-tc text-sm dark:text-white">Password</label>
                <div className="relative">
                    <input type="password" id="password" name="password"
                    placeholder='••••••••'
                    className="py-2 px-4 block w-full text-tc dark:text-neutral-200 border-gray-400 border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700" 
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <p className="hidden text-xs text-red-600 mt-2" id="password-error">
                    8+ characters required
                </p>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm text-tc dark:text-white">Confirm Password</label>
                <div className="relative">
                    <input type="password"id="confirmPassword" name="confirmPassword"
                        placeholder='••••••••'
                        className="py-2 px-4 block w-full text-tc dark:text-neutral-200 border-gray-400 border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700" 
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <p className="hidden text-xs text-red-600 mt-2" id="password-error">
                    password mismatch
                </p>
            </div>        

          <div className="flex items-center">
            <div className="flex">
              <input id="terms" name="terms" type="checkbox" required className="accent-lgg text-ow"/>
            </div>
            <div className="ms-3">
              <label htmlFor="terms" className="text-sm text-tc dark:text-ow">I accept the <a className="text-lgg cursor-pointer decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" onClick={() => setTermsModalOpen(true)}>Terms and Conditions</a></label>
            </div>
          </div>

            <button type="submit" className="w-full mt-2 py-2.5 px-4 text-lg font-medium pri-btn focus:outline-hidden focus:bg-lgd disabled:opacity-50 disabled:pointer-events-none">Sign in</button>
          </div>
        </form>
      </div>

      <Modal open={termsModalOpen} onClose={() => setTermsModalOpen(false)}>
        <TermsAndConditions />
      </Modal>
    </div>
  )
}

export default Signup