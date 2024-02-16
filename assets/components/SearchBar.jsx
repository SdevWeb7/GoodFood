import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import EventBus from "../hooks/EventBus";
import { v4 as uuidv4 } from 'uuid';

export function SearchBar ({setSearchOpen}) {
   const [recettes, setRecettes] = useState([])
   const [search, setSearch] = useState('')
   const ref = useRef(null)

   useEffect(() => {
      document.addEventListener('click', handleClose)

      return () => {
         document.removeEventListener('click', handleClose)
      }
   }, [])

   useEffect(() => {
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
               onChange={e => setSearch(e.target.value)}
               placeholder={'Chercher une recette'}
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

         </div>
      </>,
      document.body)
}