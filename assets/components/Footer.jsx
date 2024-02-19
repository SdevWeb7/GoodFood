import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollY } from "../hooks/useScrollY";
import { footerVariants } from "../utils";
import { useTheme } from "../hooks/useTheme";
import { Monney } from "../svg/Monney";

export function Footer () {

   const { theme, setTheme } = useTheme()
   const { isScrolledBot } = useScrollY()

   const handleTheme = (e) => {
      e.preventDefault()
      setTheme(t => t === 'light' ? 'dark' : 'light')
   }

   return (
      <motion.footer
         initial={'visible'}
         animate={isScrolledBot || window.scrollY < 30 ? 'visible' : 'hidden'}
         variants={footerVariants}
         transition={{duration: .3}}
         className="footer">

         <Link
            to={'/stripe-payment'}
            target={'_blank'}
            className={'stripe-don'}>
            <span>Faire un don</span>
            <Monney />
         </Link>

         <a
            href={'#'}
            onClick={handleTheme}
            data-isdark={theme === 'dark'}
            className="btn-theme">
            <span className={'switcher'}></span>
         </a>
      </motion.footer>
   )
}