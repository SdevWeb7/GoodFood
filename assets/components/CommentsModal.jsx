import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from 'uuid';
import { IconClose } from "../svg/IconClose";


export function CommentsModal ({comments, setModalComments}) {

   const ref = useRef(null)

   useEffect(() => {
      document.addEventListener('click', handleClose)

      return () => {
         document.removeEventListener('click', handleClose)
      }
   }, [])

   const handleClose = (e) => {
      if (!ref.current.contains(e.target)) {
         setModalComments(false)
      }
   }


   return createPortal(
      <section ref={ref} className="modal-comments">
         <p className={'close'}>
            <IconClose onClick={() => setModalComments(false)} />
         </p>

         {comments.map(c => <p key={uuidv4()}>{c.user ? c.user.email : ''} : {c.content}</p>)}


      </section>,
      document.body)
}