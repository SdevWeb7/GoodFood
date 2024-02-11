import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";

export function MesRecettes () {
   const [myRecettes, setMyRecettes] = useState([])

   useEffect(() => {
      fetch('/api_mes_recettes').then(r => {
         if (!r.ok) {
            eventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
            throw new Error('Problème serveur')
         }
         return r.json()
      }).then(recettes => setMyRecettes(recettes))
         .catch(e => console.log(e))
   }, [])

   console.log(myRecettes)

   return (
      <div className={'mes-recettes'}>
         <h1>Mes Recettes</h1>

         {myRecettes.length > 0 ?
            <div>recettes</div> :
            <div>Aucune Recette, ajoutez-en !</div>}
      </div>
   )
}