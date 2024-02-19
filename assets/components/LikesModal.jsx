import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from 'uuid';
import { IconClose } from "../svg/IconClose";


export function LikesModal ({likes, setLikesModal}) {

   const ref = useRef(null)

   useEffect(() => {
      document.addEventListener('click', handleClose)

      return () => {
         document.removeEventListener('click', handleClose)
      }
   }, [])

   const handleClose = (e) => {
      if (!ref.current.contains(e.target)) {
         setLikesModal(false)
      }
   }


   return createPortal(
      <section ref={ref} className="modal-comments">

         <p className={'close'}>
            <IconClose onClick={() => setLikesModal(false)} />
         </p>

         {likes.map(l => <p key={uuidv4()}>
            {l.user ? l.user.email : ''}</p>)}

      </section>,
      document.body)
}