import React, { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setLoginOpen, setIsPasswordForgot, onClose, setIsLogged }) => {
  const [isPasswordHidden, setPasswordHidden] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent form from reloading page
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:8080/api/user/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLogged(true)
        onClose();
        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userData.role === 'pickup_staff') {
          navigate('/pickup/dashboard');
        } else if (userData.role === 'delivery_staff') {
          navigate('/delivery/dashboard');
        } else {
          navigate('/'); // for customers
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Invalid email or password');
      } else {
        setErrorMsg('Server error. Try again later.');
      }
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="text-center">
        <h1 className="block text-2xl font-semibold text-tc dark:text-ow">Sign in</h1>
        <p className="mt-2 text-base text-gray-600 dark:text-neutral-300">
          New to Green Bin?
          <span
            className="text-lgg cursor-pointer decoration-1 ml-1 hover:underline font-medium"
            onClick={setLoginOpen}
          >
            Sign up here
          </span>
        </p>
      </div>

      <div className="mt-5">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-2 sm:gap-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-tc dark:text-white">Email</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="abc123@gmail.com"
                  className="py-2 px-4 block w-full text-tc dark:text-neutral-200 border-gray-400 border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 dark:border-neutral-700 dark:placeholder-neutral-500"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block mb-1 text-tc dark:text-white">Password</label>
                <span
                  className="inline-flex cursor-pointer text-sm text-neutral-500 hover:text-lgg"
                  onClick={setIsPasswordForgot}
                >
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={isPasswordHidden ? 'password' : 'text'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="py-2 px-4 block w-full text-tc dark:text-neutral-200 border-gray-400 border rounded-lg focus:outline-none focus:border-lgg focus:ring-lgg disabled:opacity-50 dark:border-neutral-700"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="text-gray-400 absolute cursor-pointer right-3 text-xl inset-y-0 my-auto active:text-lgg"
                  onClick={() => setPasswordHidden(!isPasswordHidden)}
                >
                  {isPasswordHidden ? <LuEye /> : <LuEyeOff />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-center text-xs text-red-600 mt-2">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 text-lg font-medium pri-btn focus:outline-hidden disabled:opacity-50"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
