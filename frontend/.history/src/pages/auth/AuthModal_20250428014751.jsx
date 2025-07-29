import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import ForgotPassword from './FogotPassword'
import Login from './Login'
import Signup from './Signup'

const AuthModal = ({authOpen, loginOpen, setLoginOpen, onClose, setIsLogged}) => {
      const [isPasswordForgot, setIsPasswordForgot] = useState(false)
      useEffect(() => {
        if (!authOpen) {
          setIsPasswordForgot(false)
        }
      }, [authOpen])
  return (
    <Modal
        open={authOpen}
        onClose={onClose}
    >
        {
            isPasswordForgot ? <ForgotPassword setIsPasswordForgot={setIsPasswordForgot} /> :
                loginOpen ? <Login setLoginOpen={setLoginOpen} onClose={onClose} setIsPasswordForgot={() => setIsPasswordForgot(prev => !prev)} setIsLogged={setIsLogged} /> : 
                    <Signup setLoginOpen={setLoginOpen}/>
        }
    </Modal>
  )
}

export default AuthModal