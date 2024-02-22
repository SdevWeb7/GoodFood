import React, { useState } from "react";
import { Fader } from "../components/Fader";
import EventBus from "../hooks/EventBus";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactSchema } from "../FormSchemas";
import { useMutation } from "react-query";
import { apiContact } from "../ApiFunctions";

export function Contact () {
   const [symfonyError, setSymfonyError] = useState('')
   const {register, handleSubmit,
      formState: {isValid, isSubmitting, errors}} = useForm(
         {mode: 'onBlur', resolver: yupResolver(contactSchema)})
   const { mutate } = useMutation(apiContact, {
      onSuccess: datas => {
         if (datas.error) setSymfonyError(datas.error)
         else window.location.href = '/'
      },
      onError: () => EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème Serveur']}])
   })

   const onSubmit = (data) => { mutate(data) }


   return <Fader><form className={'auth-form'}>

         <h1>Contact</h1>

         {symfonyError.length > 1 && <p>{symfonyError}</p>}


         <input
            placeholder={'Votre adresse e-mail'}
            autoComplete={'current-email'}
            {...register("email", { required: true })} />
         {errors.email && <span>{errors.email.message}</span>}


         <textarea
            placeholder={'Votre Message'}
            {...register("message", { required: true })} />
         {errors.message && <span>{errors.message.message}</span>}


         <input
            type={"submit"}
            className={`btn ${!isValid || isSubmitting ? '' : 'submit-valid'}`}
            onClick={handleSubmit(onSubmit)}
            value={'Envoyer'} />

      </form></Fader>
}