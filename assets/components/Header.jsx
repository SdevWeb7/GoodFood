import React from "react";
import { NavLink } from "react-router-dom";
import { Burger } from "./Burger";
import { motion } from "framer-motion";
import { useScrollY } from "../hooks/useScrollY";
import { headerVariants } from "../utils";
import { useAppStore } from "../store";

export function Header () {
   const user = useAppStore.use.user()
   const { isScrolledBot } = useScrollY()
   const isOpenMenu = useAppStore.use.isOpenMenu()


   return (
      <motion.header
         initial={'visible'}
         animate={isScrolledBot && !isOpenMenu ? 'hidden' : 'visible'}
         variants={headerVariants}
         transition={{duration: .5}}
         className="header">

         <nav className="navbar">
            <NavLink to={'/'} className={'logo-container'}>
               <h1 className={'logo'}>🥕</h1>
               <p><span>G</span>ood<span>-</span><span>F</span>ood</p>
            </NavLink>


            <NavLink className={'navlink'} to={'/recettes'}>
               Recettes</NavLink>

            {user && Object.keys(user).length > 0 &&
               <NavLink className={'navlink'} to={'/mes-recettes'}>
                  Mes recettes</NavLink>}

            <NavLink className={'navlink'} to={'/contact'}>
               Contact</NavLink>
         </nav>

         <Burger />

      </motion.header>
   )
}