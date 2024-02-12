import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { Spinner } from "../../components/Spinner";
import { useAppStore } from "../../store";

export function RecetteNew () {
   const user = useAppStore.use.user()

   useEffect(() => {

   }, [])


   if (user === null) {
      return <Spinner />
   } else if (Object.keys(user).length === 0) {
      window.location = '/'
   } else {
      return (
         <div className={'recette-new'}>
            <h1>Création d'une recette</h1>
         </div>)
   }
}
