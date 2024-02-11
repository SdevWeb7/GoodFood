import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollY } from "../hooks/useScrollY";
import { footerVariants } from "../utils";
import { useTheme } from "../hooks/useTheme";

export function Footer () {

   const { theme, setTheme } = useTheme()
   const { isScrolledBot } = useScrollY()

   const handleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

   return (
      <motion.footer
         initial={'visible'}
         animate={isScrolledBot || window.scrollY < 30 ? 'visible' : 'hidden'}
         variants={footerVariants}
         transition={{duration: .5}}
         className="footer">

         <nav className="navbar">
            <Link to={'https://www.linkedin.com/in/steven-durand-1486b82a1/'} target={'_blank'}>
               Faire un don <span style={{fontSize: '1.5rem'}}>🫶</span>
            </Link>

         </nav>

         <motion.div
            onClick={handleTheme}
            data-isdark={theme === 'dark'}
            className="btn-theme">
            <motion.div layout></motion.div>
         </motion.div>
      </motion.footer>
   )
}