import React, { useState } from "react";
import eventBus from "../hooks/EventBus";
import { CommentsModal } from "./CommentsModal";
import { useAppStore } from "../store";

export function Comment ({recette, setRecettes}) {

   const user = useAppStore.use.user()
   const [comment, setComment] = useState('')
   const [modalComments, setModalComments] = useState(false)

   const addComment = () => {
      if (comment.length > 4) {
         fetch(`/api_comment/${recette.id}`, {
            method: 'POST',
            body: comment
         })
            .then(r => {
               if (!r.ok) {
                  eventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
                  throw new Error('Problème serveur')
               }
               return r.json()
         }).then(datas => {
            if (datas.error) {
               eventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
               throw new Error('Problème serveur')
            } else if (datas.success) {
               eventBus.emit('ToastMessage', [{type: 'success', messages: [datas.success]}])
               setComment('')
               setRecettes(prevRecettes => prevRecettes.map(r => {
                  if (r.id === recette.id) {
                     recette.comments.push({recette: recette, user: {email: user.email}})
                  }
                  return r
               }))

            }
         }).catch(e => console.log(e))
      }
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

         <p style={{cursor: "pointer"}} onClick={handleModal}>
            {recette.comments.length} commentaire(s)</p>

         {modalComments &&
            <CommentsModal comments={recette.comments} setModalComments={setModalComments} />}
      </section>)
}
