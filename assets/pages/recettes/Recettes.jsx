import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { v4 as uuidv4 } from 'uuid';
import { NavLink } from "react-router-dom";

export function Recettes () {
   const [recettes, setRecettes] = useState([])
   const [page, setPage] = useState(1)
   const [totalRecettes, setTotalRecettes] = useState(0)
   const [nombrePages, setNombrePages] = useState(0)
   const [perPage, setPerPage] = useState(5)

   useEffect(() => {
      fetch(`/api_recettes/${page}/${perPage}`).then(r => {
         if (!r.ok) {
            eventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
            throw new Error('Problème serveur')
         }
         return r.json()
      }).then(datas => {
            setRecettes(datas.recettes)
            setTotalRecettes(datas.totalRecettes)
            setNombrePages(Math.ceil(datas.totalRecettes / perPage))
         })
         .catch(e => console.log(e))
   }, [page])


   return (
      <div className={'recettes'}>
         <h1>Recettes</h1>
         <h2>{totalRecettes} recettes (Page {page})</h2>

         <nav className="pagination">
            {page > 1 &&
            <><button className={'btn'} onClick={() => setPage(1)}>Première Page</button>
            <button className={'btn'} onClick={() => setPage(p => p > 1 ? p - 1 : p)}>Page Précédente</button></>}

            {page < nombrePages &&
            <><button className={'btn'} onClick={() => setPage(p => p < nombrePages ? p + 1 : nombrePages)}>Page Suivante</button>
            <button className={'btn'} onClick={() => setPage(nombrePages)}>Dernière Page ({nombrePages})</button></>}
         </nav>


         <div className="recettes-container">

         {recettes.length > 0 ?
            recettes.map(recipe => <NavLink to={`/recette/details/${recipe.id}`} key={uuidv4()} className={'recette'}>
               <p className={'title'}>{recipe.name}</p>

               <p>{recipe.description}</p>

               <img src={recipe.image ?? 'http://via.placeholder.com/250x150'} alt="recette-image" />

               <p>Créé par: {recipe.user ? recipe.user.email : 'Anonyme'}</p>
            </NavLink>) :
            <p>Aucune Recette, ajoutez-en !</p>}
         </div>
      </div>
   )
}
