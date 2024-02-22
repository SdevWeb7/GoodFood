import React from "react";
import { NavLink } from "react-router-dom";
import { Burger } from "./Burger";
import { Search } from "./Search";
import { Cerise } from "../svg/Cerise";
import { useQuery } from "react-query";
import { apiMe } from "../ApiFunctions";

export function Header () {
   const { data: user } = useQuery(['user'], () => apiMe())

   return (
      <header className="header">

         <nav className="navbar">
            <NavLink to={'/'} className={'logo'}>
               <h1 className={'icon-cerise'}>
                  <Cerise />
               </h1>
               <h1
                  aria-label={'Titre-Good-Food'}
                  className={'title'}>Good-Food</h1>
            </NavLink>


            <NavLink
               className={'navlink'}
               to={'/recettes'}>Recettes</NavLink>

            {user && Object.keys(user).length > 0 &&
            <NavLink
               className={'navlink'}
               to={'/mes-recettes'}>Mes recettes</NavLink>}

            <NavLink
               className={'navlink'}
               to={'/contact'}>Contact</NavLink>
         </nav>

         <Search />

         <Burger />

      </header>
   )
}