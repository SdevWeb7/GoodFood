import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { v4 as uuidv4 } from 'uuid';
import { NavLink } from "react-router-dom";
import { Paginator } from "../../components/Paginator";
import { Like } from "../../components/Like";
import { Comment } from "../../components/Comment";

export function Recettes () {
   const [recettes, setRecettes] = useState([])
   const [page, setPage] = useState(1)
   const [totalRecettes, setTotalRecettes] = useState(0)
   const [nombrePages, setNombrePages] = useState(0)
   const [perPage, setPerPage] = useState(6)

   useEffect(() => {
      fetch(`/api_recettes/${page}/${perPage}`).then(r => {
         if (!r.ok) {
            eventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
            throw new Error('Problème serveur')
         }
         return r.json()
      }).then(datas => {
         if (Object.entries(datas).length > 0) {
            setRecettes(datas.recettes)
            setTotalRecettes(datas.totalRecettes)
            setNombrePages(Math.ceil(datas.totalRecettes / perPage))
         }
      }).catch(e => console.log(e))
   }, [page])



   return (
      <section className={'recettes'}>
         <h1>Recettes</h1>
         <h2>{totalRecettes} recettes (Page {page} / {nombrePages})</h2>


         <Paginator
            page={page}
            setPage={setPage}
            nombrePages={nombrePages} />


         <div className="recettes-container">
         {recettes.length > 0 ? recettes.map(recipe =>
            <article
               key={uuidv4()}
               className={'recette'}>

               <Like
                  className={'like'}
                  setRecettes={setRecettes}
                  recipe={recipe} />

               <p className={'title'}>{recipe.name}</p>

               <p>{recipe.description}</p>

               <NavLink to={`/recette/details/${recipe.id}`}>
                  <img
                     src={recipe.image ?
                        `/images/recettes/${recipe.image}` : '/images/antarctique.jpg'}
                     alt="recette-image" />
               </NavLink>

               <p>Créé par {recipe.user ? recipe.user.email : 'Anonyme'}</p>

               <Comment
                  recette={recipe}
                  setRecettes={setRecettes} />

            </article>) : <p>Aucune Recette, ajoutez-en !</p>}
         </div>
      </section>
   )
}
