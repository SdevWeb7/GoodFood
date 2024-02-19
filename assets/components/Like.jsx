import React, { useState } from "react";
import eventBus from "../hooks/EventBus";
import { HeartArrowFilled } from "../svg/HeartArrowFilled";
import { HeartArrow } from "../svg/HeartArrow";
import { useAppStore } from "../store";
import { LikesModal } from "./LikesModal";

export function Like ({setRecettes, recipe}) {
   const user = useAppStore.use.user()
   const [likesModal, setLikesModal] = useState(false)

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
            setRecettes(prevRecettes => {
               return prevRecettes.map(r => {
                  if (r.id === id) {
                     r.likes.push({user: {email: user.email}})
                  }
                  return r
               })
            })
         } else {
            eventBus.emit('ToastMessage', [{type: 'info', messages: [datas.info]}])
            setRecettes(prevRecettes => {
               return prevRecettes.map(r => {
                  if (r.id == id) {
                     r.likes = r.likes.filter(l => l.user.email !== user.email)
                  }
                  return r
               })
            })
         }
      }).catch(e => console.log(e))
   }
   const handleModal = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setLikesModal(v => !v)
   };

   return (
      <div className={'like'}>

         <p
            style={{cursor: 'pointer'}}
            onClick={handleModal}><u>{recipe.likes.length} like(s)</u></p>


         {user && recipe.likes.some(like => like.user.email === user.email) ?
            <HeartArrowFilled
               onClick={() => handleLike(recipe.id)} /> :
            <HeartArrow
               onClick={() => handleLike(recipe.id)} />
         }


         {likesModal &&
         <LikesModal
            likes={recipe.likes}
            setLikesModal={setLikesModal} />}
      </div>
   )
}