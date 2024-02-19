import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import EventBus from "../hooks/EventBus";
import { v4 as uuidv4 } from 'uuid';

export function SearchBar ({setSearchOpen}) {
   const [recettes, setRecettes] = useState([])
   const [search, setSearch] = useState('')
   const [searchIngredient, setSearchIngredient] = useState('')
   const ref = useRef(null)

   useEffect(() => {
      document.addEventListener('click', handleClose)

      return () => {
         document.removeEventListener('click', handleClose)
      }
   }, [])

   useEffect(() => {
      if (search.length > 1) {
         setSearchIngredient('')
         fetch(`/api_search_recette/${search}`)
            .then(r => {
               if (!r.ok) {
                  EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
                  throw new Error('Problème serveur')
               }
               return r.json()
            }).then(datas => {
               if (datas.error) {
                  EventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
                  throw new Error('Problème serveur')
               }
               setRecettes(datas)
            })
            .catch(e => console.log(e))
      }
   }, [search])

   useEffect(() => {
      if (searchIngredient.length > 1) {
         setSearch('')
         fetch(`/api_search_ingredient/${searchIngredient}`)
            .then(r => {
               if (!r.ok) {
                  EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
                  throw new Error('Problème serveur')
               }
               return r.json()
            }).then(datas => {
               if (datas.error) {
                  EventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
                  throw new Error('Problème serveur')
               }

               let tempRecettes = []
               for (let ingredient of datas) {
                  tempRecettes.push(ingredient.recette)
               }
               setRecettes(tempRecettes)
            })
            .catch(e => console.log(e))
      }
   }, [searchIngredient])

   const handleClose = (e) => {
      if (e.target === ref.current) {
         setSearchOpen(false)
      }
   }


   return createPortal(
         <section ref={ref} className="background-search">

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

            {recettes.length > 0 && recettes.map(r =>
                  <NavLink
                     key={uuidv4()}
                     to={`/recette/details/${r.id}`}
                     onClick={() => setSearchOpen(false)}>
                     {r.name}</NavLink>)}


            {recettes.length === 0 &&
               <p>Aucun résultat</p>}
            </section>
         </section>,
      document.body)
}