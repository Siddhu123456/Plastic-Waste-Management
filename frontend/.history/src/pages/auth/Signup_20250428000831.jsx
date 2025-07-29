import React, { useState } from 'react'
import Modal from '../../components/Modal'
import TermsAndConditions from '../../components/TermsAndConditions'
import axios from 'axios'

const Signup = ({setLoginOpen}) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [termsModalOpen, setTermsModalOpen] = useState(false)

  const validateForm = () => {
    // Validate Name: At least 3 letters, only alphabets
    const nameRegex = /^[A-Za-z]{3,}$/;
    if (!nameRegex.test(name)) {
      alert("Name must be at least 3 characters and contain only alphabets.");
      return false;
    }

    // Validate Email: simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    // Validate Password: 6+ characters, combination of letters and numbers
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters and include both letters and numbers.");
      return false;
    }

    // Confirm Password Match
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users/signup', {
        email,
        name,
        password,
      });
      alert('Signup successful!');
      setLoginOpen(); // Open login modal/page
    } catch (error) {
      console.error(error);
      alert('Signup failed! ' + (error.response?.data?.message || 'Try again.'));
    }
  };

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
      <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-y-2">

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
            </div>        

          <div className="flex items-center">
            <div className="flex">
              <input id="terms" name="terms" type="checkbox" required className="accent-lgg text-ow"/>
            </div>
            <div className="ms-3">
              <label htmlFor="terms" className="text-sm text-tc dark:text-ow">I accept the <a className="text-lgg cursor-pointer decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" onClick={() => setTermsModalOpen(true)}>Terms and Conditions</a></label>
            </div>
          </div>
          <p className="text-xs text-center text-red-600" id="password-error">
                  {errorMsg}
            </p>
            <button type="submit" className="w-full py-2.5 px-4 text-lg font-medium pri-btn focus:outline-hidden focus:bg-lgd disabled:opacity-50 disabled:pointer-events-none">Sign in</button>
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