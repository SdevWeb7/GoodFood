import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { useParams } from "react-router-dom";
import { Spinner } from "../../components/Spinner";
import { useAppStore } from "../../store";

export function RecetteEdit () {
   const user = useAppStore.use.user()
   const { name } = useParams()

   useEffect(() => {

   }, [])


   if (user === null) {
      return <Spinner />
   } else if (Object.keys(user).length === 0) {
      window.location = '/'
   } else {
      return (
         <div className={'recette-edit'}>
            <h1>Edition Recette {name}</h1>
         </div>)
   }
}
