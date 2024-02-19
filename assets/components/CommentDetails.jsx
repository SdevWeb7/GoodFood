import React, { useState } from "react";
import eventBus from "../hooks/EventBus";
import { CommentsModal } from "./CommentsModal";

export function CommentDetails ({recette, setRecette}) {
   const [comment, setComment] = useState('')
   const [commentsModal, setCommentsModal] = useState(false)

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
               setRecette(r => {
                  recette.comments.push({commentaire: "add"})
                  return {...r}
               })
            }
         }).catch(e => console.log(e))
      }
   };
   const handleModal = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setCommentsModal(v => !v)
   };

   return (
         <div className={'comment'}>
            <p
               style={{marginBottom: '1rem', cursor: 'pointer'}}
               onClick={handleModal}>
               {recette.comments.length} commentaire(s)</p>

            <textarea
               name="comment"
               placeholder={'Laisser un commentaire'}
               value={comment}
               onChange={e => setComment(e.target.value)}></textarea>

               <button
                  className={'btn'}
                  onClick={addComment}>Commenter</button>

            {commentsModal &&
               <CommentsModal
                  setModalComments={setCommentsModal}
                  comments={recette.comments} />}
         </div>)
}