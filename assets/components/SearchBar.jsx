import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import EventBus from "../hooks/EventBus";
import { v4 as uuidv4 } from 'uuid';

export function SearchBar ({setSearchOpen}) {
   const [recettes, setRecettes] = useState([])
   const [search, setSearch] = useState('')
   const [ingredient, setIngredient] = useState({})
   const [searchIngredient, setSearchIngredient] = useState('')
   const ref = useRef(null)

   useEffect(() => {
      document.addEventListener('click', handleClose)

      return () => {
         document.removeEventListener('click', handleClose)
      }
   }, [])

   useEffect(() => {
      setSearchIngredient('')
      setIngredient({})
      if (search.length > 1) {
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
      setSearch('')
      setRecettes([])
      if (searchIngredient.length > 1) {
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
               setIngredient(datas[0])
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
      <>
         <div ref={ref} className="background-search">

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
               placeholder={'Cherche une recette par ingrédient'}
               className={'search-input'} />


            {recettes.length > 0 &&
               <div className="search-result">
                  {recettes.map(r =>
                     <NavLink
                        key={uuidv4()}
                        to={`/recette/details/${r.id}`}
                        onClick={() => setSearchOpen(false)}>
                        {r.name}</NavLink>)}
               </div>}

            {ingredient && Object.entries(ingredient).length > 0 &&
            <div className="search-result">
               {ingredient.recettes.map(r =>
                  <NavLink
                     key={uuidv4()}
                     to={`/recette/details/${r.id}`}
                     onClick={() => setSearchOpen(false)}>
                     {r.name}</NavLink>)}
            </div>}

         </div>
      </>,
      document.body)
}