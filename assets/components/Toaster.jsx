import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import EventBus from "../hooks/EventBus";
import { findClassByType, toasterVariants } from "../utils";
import { IconClose } from "../svg/IconClose";
import { v4 as uuidv4 } from 'uuid';

export function Toaster () {
   const [toasts, setToasts] = useState([])

   useEffect(() => {
      const flashsSymfony = JSON.parse(
         document.getElementById('react').getAttribute('data-toasts'))

      if (flashsSymfony && flashsSymfony.length > 0) {
         setToasts((prevToasts) => [...prevToasts, ...flashsSymfony]);
      }

      EventBus.on('ToastMessage', handleToastMessage);

      return () => {
         EventBus.off('ToastMessage', handleToastMessage)
      }
   }, [])

   useEffect(() => {
      if (toasts.length > 0) {
         const timer = setTimeout(() => {
            setToasts([])
         }, 5000)

         return () => {
            clearTimeout(timer)
         }
      }
   }, [toasts])


   const handleToastMessage = (datas) => {
      setToasts((prevToasts) => [...prevToasts, ...datas]);
   }

   return <><AnimatePresence>

         {toasts.length > 0 &&
            <motion.div
               className="toaster"
               animate={toasts.length > 0 ? 'visible' : 'hidden'}
               variants={toasterVariants}
               exit={'hidden'}
               initial={'hidden'}
               transition={{duration: .3}}>

               <IconClose onClick={() => setToasts([])} />

            {toasts.map(({type, messages}) => messages.map(message => <p
               key={uuidv4()} className={findClassByType(type)}>
               {message}</p>))}
         </motion.div>}

         </AnimatePresence></>
}
export default Toaster;