import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../FormSchemas";
import EventBus from "../hooks/EventBus";
import { Fader } from "../components/Fader";
import { useMutation } from "react-query";
import { apiRequestPassword } from "../ApiFunctions";

export function ResetPassword () {

   const {register, handleSubmit,
      formState: {isValid, isSubmitting, errors}} = useForm({
         mode: 'onBlur',
         resolver: yupResolver(resetPasswordSchema)
   })
   const { mutate } = useMutation(apiRequestPassword, {
      onSuccess: datas => {
         if (datas.error) EventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
         else window.location.href = '/'
      },
      onError: () => EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème Serveur']}])
   })

   const onSubmit = (data) => { mutate(data) }

   return <Fader><form className={'auth-form'}>
         <h1>Réinitialisation du mot de passe</h1>


         <input
            placeholder={'Email Address'}
            {...register("email", { required: true })}
            autoComplete={'current-email'} />
         {errors.email && <span>{errors.email.message}</span>}


         <input
            type={"submit"}
            value={'Faire la demande'}
            onClick={handleSubmit(onSubmit)}
            className={`btn ${!isValid || isSubmitting ? '' : 'submit-valid'}`} />

      </form></Fader>
}
