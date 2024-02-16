import React, { useState } from 'react';
import eventBus from "../hooks/EventBus";
import { HeartArrowFilled } from "../svg/HeartArrowFilled";
import { HeartArrow } from "../svg/HeartArrow";
import { useAppStore } from "../store";

export function LikeDetails ({recette, setRecette}) {
   const user = useAppStore.use.user()

   const handleLike = (id) => {
      fetch(`/api_like/${id}`).then(r => {
         if (!r.ok) {
            eventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
            throw new Error('Problème serveur')
         }
         return r.json()
      }).then(datas => {
         if (datas.error) {
            eventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
            throw new Error('Problème serveur')
         }
         if (datas.success) {
            eventBus.emit('ToastMessage', [{type: 'success', messages: [datas.success]}])
            setRecette(r => {
               r.likes.push({user: {email: user.email}})
               return {...r}
            })
         } else {
            eventBus.emit('ToastMessage', [{type: 'info', messages: [datas.info]}])
            setRecette (r => {
               r.likes = r.likes.filter(l => l.user.email !== user.email)
               return {...r}
            })
         }
      }).catch(e => console.log(e))
   }

   return (
      <div className={'like'}>
         <p style={{marginRight: '1rem'}}>{recette.likes.length} like(s)</p>

         {user && recette.likes.some(like => like.user.email === user.email) ?
            <HeartArrowFilled onClick={() => handleLike(recette.id)} /> :
            <HeartArrow onClick={() => handleLike(recette.id)} />
         }
      </div>
   )
}
