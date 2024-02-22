import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { NavLink } from "react-router-dom";
import { Spinner } from "../../components/Spinner";
import { Modify } from "../../svg/Modify";
import { Delete } from "../../svg/Delete";
import { Paginator } from "../../components/Paginator";
import { Add } from "../../svg/Add";
import { useMutation, useQuery } from "react-query";
import { apiDeleteRecette, apiMe, apiShowMesRecettes } from "../../ApiFunctions";
import EventBus from "../../hooks/EventBus";

export function MesRecettes () {
   const { data:user, isError, isFetching } = useQuery(['user'], apiMe)
   const [page, setPage] = useState(1)
   const [perPage, setPerPage] = useState(6)
   const { data, refetch} = useQuery(['mesRecettes'],
         () => apiShowMesRecettes(page, perPage), {
      enabled: !!user})
   const { mutate } = useMutation(apiDeleteRecette, {
      onSuccess: datas => {
         if (datas.error) EventBus.emit('ToastMessage', [{type: "error", messages: [datas.error]}])
         else EventBus.emit('ToastMessage', [{type: "info", messages: ['Recette supprimée']}])
      },
      onError: () => EventBus.emit('ToastMessage', [{type: "error", messages: ['Problème Serveur']}])
   })

   useEffect(() => {
      refetch()
   }, [page])

   if (isFetching) return <Spinner />

   if (isError) return <h1>Il y a eu une erreur
      <button onClick={() => refetch()}>
         Réessayer</button></h1>


   const handleDelete = (e, id) => {
      e.preventDefault()
      if (confirm('Etes-vous sur de vouloir supprimer la recette ?')) {
         mutate(id)
      }
   };


   if (user === undefined) return <Spinner />

   else if (Object.keys(user).length === 0) window.location = '/'

   else return <section className={'recettes'}>

         <h1>Mes recettes</h1>
         <h2>
            <NavLink
               to={'/recette/creer'}>
               <Add className={'btn-add'} />
            </NavLink>
            {data?.totalRecettes ?? 0} recettes (Page {data?.totalRecettes ? page : 0} / {Math.ceil(data?.totalRecettes ? data.totalRecettes / perPage : 0)})
         </h2>


         <Paginator
            page={page}
            setPage={setPage}
            nombrePages={Math.ceil(data?.totalRecettes ? data.totalRecettes / perPage : 0)} />


         <section className="recettes-container">
            {data && data.recettes.length > 0 ?
               data.recettes.map(recipe =>
                  <article key={uuidv4()} className={'recette'}>

                     <div className="actions">
                        <NavLink
                           to={`/recette/editer/${recipe.id}`}>
                           <Modify />
                        </NavLink>

                        <NavLink>
                           <Delete onClick={e => handleDelete(e, recipe.id)} />
                        </NavLink>
                     </div>

                     <p className={'title'}>{recipe.name}</p>

                     <NavLink
                        to={`/recette/details/${recipe.id}`}>
                        <img
                           src={recipe.image ?
                              `/images/recettes/${recipe.image}` :
                              '/images/antarctique.jpg'}
                           alt="recette-image" />
                     </NavLink>

                     <p>{recipe.description}</p>

                  </article>) : <p>Aucune Recette, ajoutez-en !</p>}
         </section>

      </section>
}
