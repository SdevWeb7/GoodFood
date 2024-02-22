import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { NavLink } from "react-router-dom";
import { Paginator } from "../../components/Paginator";
import { Like } from "../../components/Like";
import { Comment } from "../../components/Comment";
import { useQuery } from "react-query";
import { apiShowRecettes } from "../../ApiFunctions";
import { Spinner } from "../../components/Spinner";

export function Recettes () {
   const [page, setPage] = useState(1)
   const [perPage, setPerPage] = useState(6)
   const { data, refetch, isFetching, isError} = useQuery(['recettes'],
      () => apiShowRecettes(page, perPage))

   useEffect(() => {
      refetch()
   }, [page])

   if (isFetching) return <Spinner />

   if (isError) return <h1>Il y a eu une erreur
                        <button onClick={() => refetch()}>
                           Réessayer</button></h1>

   else return <section className={'recettes'}>
         <h1>Recettes</h1>
         <h2>{data.totalRecettes} recettes (Page {page} / {Math.ceil(data.totalRecettes / perPage)})</h2>


         <Paginator
            page={page}
            setPage={setPage}
            nombrePages={Math.ceil(data.totalRecettes / perPage)} />


         <div className="recettes-container">
         {data.recettes.length > 0 ? data.recettes.map(recipe =>
            <article
               key={uuidv4()}
               className={'recette'}>

               <Like
                  className={'like'}
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

               <Comment recette={recipe} />

            </article>) : <p>Aucune Recette, ajoutez-en !</p>}
         </div>
      </section>
}
