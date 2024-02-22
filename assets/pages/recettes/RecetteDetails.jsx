import React from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { CommentDetails } from "../../components/CommentDetails";
import { LikeDetails } from "../../components/LikeDetails";
import { useQuery } from "react-query";
import { apiShowRecette } from "../../ApiFunctions";
import { Spinner } from "../../components/Spinner";

export function RecetteDetails () {
   const { id } = useParams()
   const {isLoading, isError, data: recette, refetch} = useQuery(
         ['recettes', id], () => apiShowRecette(id))


   if (isLoading) return <Spinner />

   else if (isError) return <h1>Il y a eu une erreur
                              <button onClick={() =>refetch()}>Réessayé</button></h1>

   else return <section className={'recette-details'}>

         {Object.entries(recette).length > 0 ?
         <><h1>{recette.name}</h1>

            <p>{recette.description}</p>

            <LikeDetails recette={recette} />
            <hr/>
            <img
               src={recette.image ?
                  `/images/recettes/${recette.image}` :
                  '/images/antarctique.jpg'} alt="recette-image" />
            <hr/>

            <h2>Ingrédients:</h2>
            {recette.ingredients.map(ing =>
               <p key={uuidv4()}>{ing.quantity} {ing.name}</p>)}

            <hr/>
            <h2>Détails de préparation</h2>
            <p>{recette.process}</p>
            <hr/>
            <h2>Temps de préparation: </h2>
            <p>{recette.duration} minute(s)</p>
            <hr/>
            <h2>Informations complémentaires:</h2>
            <p>{recette.more}</p>
            <hr/>
            <h2>Créé par:</h2>
            <p>{recette.user ? recette.user.email : 'Anonyme'}</p>
            <hr/>

            <CommentDetails recette={recette} /></> :

            <h1>Recette Introuvable</h1>}
      </section>
}
