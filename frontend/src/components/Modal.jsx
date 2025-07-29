import { LuX } from 'react-icons/lu'

  
  const Modal = ({ open, onClose, children }) => {    
    if(!open)
        return null


    return (
    <div 
        className="z-50 p-8 flex flex-col inset-0 items-center justify-center h-dvh fixed bg-black/70"
    >
          <div className="relative z-10 overflow-y-auto max-h-dvh bg-ow border w-90 sm:w-md lg:w-lg border-gray-200 rounded-md dark:bg-dsc dark:border-neutral-700
                            [&::-webkit-scrollbar]:w-1
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:rounded-none
                            [&::-webkit-scrollbar-thumb]:bg-lgd
          ">
          <button
           className='absolute top-2 right-3 cursor-pointer text-tc bg-neutral-50 dark:bg-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 p-0.5 rounded-md dark:text-ow active:text-lgg'
           onClick={onClose}
           >
             <LuX size={25} />
          </button>
            {children}
          </div>
    </div>
      )
  }
  
  export default Modal