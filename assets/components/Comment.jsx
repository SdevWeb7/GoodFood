import React, { useState } from "react";
import { CommentsModal } from "./CommentsModal";
import { useMutation, useQueryClient } from "react-query";
import { apiComment } from "../ApiFunctions";
import EventBus from "../hooks/EventBus";

export function Comment ({recette}) {

   const [comment, setComment] = useState('')
   const [modalComments, setModalComments] = useState(false)
   const queryClient = useQueryClient()
   const { mutate } = useMutation(() => apiComment(recette.id, comment), {
      onSuccess: datas => {
         if (datas.success) {
            EventBus.emit('ToastMessage', [{type: 'success', messages: [datas.success]}])
            queryClient.invalidateQueries(['recettes'])
         }
         else if (datas.error) EventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
      },
      onError: () => EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème Serveur']}])
   })

   const addComment = () => {
      if (comment.length > 4) mutate()
   };
   const handleModal = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setModalComments(v => !v)
   };


   return (
      <section className={'comment'}>
         <textarea
            name="comment"
            placeholder={'Laisser un commentaire'}
            value={comment}
            onChange={e => setComment(e.target.value)}></textarea>


         <button
            className={'btn'}
            onClick={addComment}>Commenter</button>

         <p
            style={{cursor: "pointer"}}
            onClick={handleModal}>
            <u>{recette.comments.length} commentaire(s)</u></p>


         {modalComments &&
            <CommentsModal
               comments={recette.comments}
               setModalComments={setModalComments} />}
      </section>)
}
