import React, { useState } from 'react';
import { HeartArrowFilled } from "../svg/HeartArrowFilled";
import { HeartArrow } from "../svg/HeartArrow";
import { LikesModal } from "./LikesModal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiLike, apiMe } from "../ApiFunctions";
import EventBus from "../hooks/EventBus";

export function LikeDetails ({recette}) {
   const { data: user } = useQuery(['user'], () => apiMe())
   const [likesModal, setLikesModal] = useState(false)
   const queryClient = useQueryClient()
   const { mutate } = useMutation(apiLike, {
      onSuccess: data => {
         if (data.success) {
            EventBus.emit('ToastMessage', [{type: 'success', messages: ['Merci d\'avoir liké']}])
            queryClient.invalidateQueries(['recettes'])
         }
         else if (data.info) {
            EventBus.emit('ToastMessage', [{type: 'info', messages: [data.info]}])
            queryClient.invalidateQueries(['recettes'])
         }
         else if (data.error) EventBus.emit('ToastMessage', [{type: 'error', messages: [data.error]}])
      },
      onError: () => EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème Serveur']}])
   })

   const handleLike = (recetteId) => { mutate(recetteId) }

   const handleModal = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setLikesModal(v => !v)
   };


   return (
      <div className={'like'}>
         <p
            style={{marginRight: '1rem', cursor: 'pointer'}}
            onClick={handleModal}>
            <u>{recette.likes.length} like(s)</u></p>


         {user && recette.likes.some(like => like.user.email === user.email) ?
            <HeartArrowFilled
               onClick={() => handleLike(recette.id)} /> :
            <HeartArrow
               onClick={() => handleLike(recette.id)} />}


         {likesModal &&
            <LikesModal
               setLikesModal={setLikesModal}
               likes={recette.likes} /> }
      </div>
   )
}
