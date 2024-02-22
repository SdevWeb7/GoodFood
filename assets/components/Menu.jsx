import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { linksVariants } from '../utils'
import { createPortal } from "react-dom";
import { useAppStore } from "../store";
import { useQuery } from "react-query";
import { apiMe } from "../ApiFunctions";

export function Menu () {
   const { data: user } = useQuery(['user'], () => apiMe())
   const setOpenMenu = useAppStore.use.setOpenMenu()

   useEffect(() => {
      document.addEventListener('click', handleClick)

      return () => {
         document.removeEventListener('click', handleClick)
      }
   }, [])

   const handleClick = () => {setOpenMenu(false)}

   return createPortal(
      <motion.div
         initial={{opacity: 0}}
         exit={{opacity: 0}}
         animate={{opacity: 1}}
         transition={{duration: .3}}
         className="background-menu">

         <motion.section
         initial={{x: 300}}
         exit={{x: 300}}
         animate={{x: 0}}
         transition={{duration: .3}}
         className="menu">

         <nav className="nav-menu">
            <motion.ul
               initial={'hidden'}
               exit={'hidden'}
               animate={'visible'}
               transition={{delayChildren: .4, staggerChildren: .15}}>

               <motion.li variants={linksVariants}>
                  <NavLink to={"/recettes"}>Recettes</NavLink>
               </motion.li>

               {user && Object.keys(user).length > 0 &&
                  <motion.li variants={linksVariants}>
                     <NavLink to={"/mes-recettes"}>Mes recettes</NavLink>
                  </motion.li>}

               <motion.li variants={linksVariants}>
                  <NavLink to={"/contact"}>Contact</NavLink>
               </motion.li>

               {user && Object.keys(user).length > 0 ?
                  <motion.li variants={linksVariants}>
                     <a href="/logout">Déconnexion</a>
                  </motion.li> :
               <><motion.li variants={linksVariants}>
                  <NavLink to={"/login"}>Connexion</NavLink>
               </motion.li>

               <motion.li variants={linksVariants}>
                  <NavLink to={"/subscribe"}>Inscription</NavLink>
               </motion.li></>}

            </motion.ul>
         </nav>
      </motion.section>
      </motion.div>, document.body)
}
