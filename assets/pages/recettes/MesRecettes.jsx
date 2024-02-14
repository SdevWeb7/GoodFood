import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { v4 as uuidv4 } from 'uuid';
import { NavLink } from "react-router-dom";
import { useAppStore } from "../../store";
import { Spinner } from "../../components/Spinner";
import { Modify } from "../../svg/Modify";
import { Delete } from "../../svg/Delete";

export function MesRecettes () {
   const user = useAppStore.use.user()
   const [recettes, setRecettes] = useState([])
   const [page, setPage] = useState(1)
   const [totalRecettes, setTotalRecettes] = useState(0)
   const [nombrePages, setNombrePages] = useState(0)
   const [perPage, setPerPage] = useState(5)

   useEffect(() => {
      fetch(`/api_mes_recettes/${page}/${perPage}`).then(r => {
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

   const handleDelete = (e, id) => {
      e.preventDefault()
      if (confirm('Etes-vous sur de vouloir supprimer la recette ?')) {
         fetch(`/api_delete_recette/${id}`, {
            method: 'POST'
         }).then(r => {
            if (!r.ok) {
               eventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
               throw new Error('Problème serveur')
            }
            return r.json()
         }).then(datas => {
            if (datas.error) {
               eventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
               throw new Error('Problème serveur')
            }
            setRecettes(recettes.filter(r => r.id !== id))
         }).catch(e => console.log(e))
      }
   };


   if (user === null) {
      return <Spinner />
   } else if (Object.keys(user).length === 0) {
      window.location = '/'
   } else {
      return (
         <div className={'recettes'}>
            <h1>Mes recettes</h1>
            <h2>
               <NavLink className={'btn-add'} to={'/recette/creer'}>+</NavLink>
               {totalRecettes} recettes (Page {page} / {nombrePages})
            </h2>

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
                  recettes.map(recipe => <article key={uuidv4()} className={'recette'}>

                     <div className="actions">
                        <NavLink to={`/recette/editer/${recipe.id}`}>
                           <Modify />
                        </NavLink>
                        <NavLink>
                           <Delete onClick={e => handleDelete(e, recipe.id)} />
                        </NavLink>
                     </div>

                     <p className={'title'}>{recipe.name}</p>

                     <NavLink to={`/recette/details/${recipe.id}`}>
                        <img src={recipe.image ? `/images/recettes/${recipe.image}` : '/images/antarctique.jpg'} alt="recette-image" />
                     </NavLink>

                     <p>{recipe.description}</p>
                  </article>) :
                  <p>Aucune Recette, ajoutez-en !</p>}
            </div>
         </div>)
   }
}
