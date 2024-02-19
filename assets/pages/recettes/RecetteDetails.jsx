import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { CommentDetails } from "../../components/CommentDetails";
import { LikeDetails } from "../../components/LikeDetails";

export function RecetteDetails () {
   const { id } = useParams()
   const [recette, setRecette] = useState({})

   useEffect(() => {
      fetch(`/api_recette/${id}`, {
         method: 'POST'
      }).then(r => {
         if (!r.ok) {
            eventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
            throw new Error('Problème serveur')
         }
         return r.json()
      }).then(datas => {
            setRecette(datas)
         })
         .catch(e => console.log(e))
   }, [])


   return (
      <section className={'recette-details'}>

         {Object.entries(recette).length > 0 ?
         <><h1>{recette.name}</h1>
            <LikeDetails recette={recette} setRecette={setRecette} />
            <p>{recette.description}</p>
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

            <CommentDetails
               recette={recette}
               setRecette={setRecette} /></> :

            <h1>Recette Introuvable</h1>}
      </section>
   )
}
