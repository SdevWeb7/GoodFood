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
      <div className={'recettes-details'}>

         {Object.entries(recette).length > 0 ?
         <article className={'recette-container'}>
            <h1>Recette {recette.name}</h1>
            <p>{recette.description}</p>
            <img src={recette.image ?? 'http://via.placeholder.com/250x150'} alt="recette-image" />
            <p>{recette.process}</p>
            <p>{recette.duration}</p>
         </article> : <h1>Recette Introuvable</h1>}
      </div>
   )
}
