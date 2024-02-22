import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useQuery, useQueryClient } from "react-query";
import { apiSearchIngredients, apiSearchRecettes } from "../ApiFunctions";

export function SearchBar ({setSearchOpen}) {
   const [search, setSearch] = useState('')
   const [searchIngredient, setSearchIngredient] = useState('')
   const { data: recettes } = useQuery(['searchRecettes'],
      () => apiSearchRecettes(search),
      { enabled: search.length > 1 })
   const { data: recettesByIngredient } = useQuery(['searchRecettesByIngredient'],
      () => apiSearchIngredients(searchIngredient),
      { enabled: searchIngredient.length > 1 })
   const ref = useRef(null)
   const queryClient = useQueryClient()

   useEffect(() => {
      document.addEventListener('click', handleClose)

      return () => {
         document.removeEventListener('click', handleClose)
      }
   }, [])

   useEffect(() => {
      if (search.length > 1) {
         setSearchIngredient('')
         queryClient.setQueriesData(['searchRecettesByIngredient'], [])
      }
   }, [search])

   useEffect(() => {
      if (searchIngredient.length > 1) {
         setSearch('')
         queryClient.setQueriesData(['searchRecettes'], [])
      }
   }, [searchIngredient])

   const handleClose = (e) => {
      if (e.target === ref.current) {
         setSearchOpen(false)
      }
   }


   return createPortal(<section ref={ref} className="background-search">

            <input
               type="text"
               value={search}
               onChange={e => setSearch(e.target.value)}
               placeholder={'Chercher une recette'}
               className={'search-input'} />


            <input
               type="text"
               value={searchIngredient}
               onChange={e => setSearchIngredient(e.target.value)}
               placeholder={'Chercher par ingrédient'}
               className={'search-input'} />


            <section className="search-result">

            {recettes && recettes.length > 0 && recettes.map(r =>
                  <NavLink
                     key={uuidv4()}
                     to={`/recette/details/${r.id}`}
                     onClick={() => setSearchOpen(false)}>
                     {r.name}</NavLink>)}

            {recettesByIngredient && recettesByIngredient.length > 0 && recettesByIngredient.map(i =>
               <NavLink
                  key={uuidv4()}
                  to={`/recette/details/${i.recette.id}`}
                  onClick={() => setSearchOpen(false)}>
                  {i.recette.name}</NavLink>)}



               {recettes && recettes.length === 0 &&
                  (!recettesByIngredient || recettesByIngredient.length === 0) &&
                  <p>Aucun résultat</p>}

               {recettesByIngredient && recettesByIngredient.length === 0 &&
                  (!recettes || recettes.length === 0) &&
                  <p>Aucun résultat</p>}


               {!recettes && !recettesByIngredient &&
                  <p>Rechercher par recette ou par ingrédient</p>}

            </section>
         </section>,
      document.body)
}