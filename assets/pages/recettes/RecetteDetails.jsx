import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { useParams } from "react-router-dom";

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
      <article className={'recette-details'}>

         {Object.entries(recette).length > 0 ?
         <><h1>{recette.name}</h1>
            <p>{recette.description}</p>
            <hr/>
            <img src={recette.image ?? 'http://via.placeholder.com/250x150'} alt="recette-image" />
            <hr/>
            <p>Ingredients: {recette.Ingredients.map(ing => ing.name+' ')}</p>
            <hr/>
            <p>{recette.process}</p>
            <hr/>
            <p>Temps de préparation: {recette.duration} minute(s)</p>
            <hr/>
            <p>Informations complémentaires: {recette.more}</p>
            <p>Créé par: {recette.user ?? 'Anonyme'}</p></> :
            <h1>Recette Introuvable</h1>}
      </article>
   )
}
