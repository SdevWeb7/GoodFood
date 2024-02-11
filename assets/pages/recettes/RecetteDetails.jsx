import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { v4 as uuidv4 } from 'uuid';
import { NavLink, useParams } from "react-router-dom";

export function RecetteDetails () {
   const { name } = useParams()
   //
   // useEffect(() => {
   //    fetch(`/api_recettes/${page}/${perPage}`).then(r => {
   //       if (!r.ok) {
   //          eventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
   //          throw new Error('Problème serveur')
   //       }
   //       return r.json()
   //    }).then(datas => {
   //          setRecettes(datas.recettes)
   //          setTotalRecettes(datas.totalRecettes)
   //          setNombrePages(Math.ceil(datas.totalRecettes / perPage))
   //       })
   //       .catch(e => console.log(e))
   // }, [page])


   return (
      <div className={'recettes'}>
         <h1>Recette {name}</h1>
      </div>
   )
}
