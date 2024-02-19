import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { burgerVariants, closeVariants } from "../utils";
import { Menu } from "./Menu";
import { useAppStore } from "../store";
import { IconClose } from "../svg/IconClose";
import { Apple } from "../svg/Apple";

export function Burger () {
   const isOpenMenu = useAppStore.use.isOpenMenu()
   const setOpenMenu = useAppStore.use.setOpenMenu()
   const [initialLoad, setInitialLoad] = useState(true)

   useEffect(() => {setInitialLoad(false)}, [])

   const handleMenu = (e) => {
      e.stopPropagation()
      setOpenMenu()
   }

   return (
      <>
      <section
         className="burger"
         onClick={handleMenu}>

         <AnimatePresence mode={'popLayout'}>
            {isOpenMenu &&
               <motion.a
                  href="#"
                  onClick={e => e.preventDefault()}
                  initial={"hidden"}
                  exit={'hidden'}
                  animate={isOpenMenu ? 'visible' : "hidden"}
                  variants={closeVariants}
                  transition={{duration: .5}}>
                  <IconClose />
               </motion.a>}
         </AnimatePresence>

         <AnimatePresence mode={'popLayout'}>
            {!isOpenMenu &&
               <motion.a
                  href={'#'}
                  onClick={e => e.preventDefault()}
                  initial={initialLoad ? 'visible' : "hidden"}
                  exit={'hidden'}
                  animate={isOpenMenu ? 'hidden' : "visible"}
                  variants={burgerVariants}
                  transition={{duration: .5}}>
                  <Apple />
               </motion.a>}
         </AnimatePresence>

      </section>


      <AnimatePresence>
         {isOpenMenu && <Menu />}
      </AnimatePresence>
      </>
   )
}