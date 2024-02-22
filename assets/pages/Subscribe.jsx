import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchemas } from "../FormSchemas";
import EventBus from "../hooks/EventBus";
import { Spinner } from "../components/Spinner";
import { Fader } from "../components/Fader";
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery } from "react-query";
import { apiMe, apiRegister } from "../ApiFunctions";

export function Subscribe () {
   const { data: user } = useQuery(['user'], () => apiMe())
   const [symfonyErrors, setSymfonyErrors] = useState({})
   const {register, handleSubmit,
      formState: {isValid, isSubmitting, errors}} = useForm({
         mode: 'onBlur',
         resolver: yupResolver(registerSchemas)
   })
   const { mutate } = useMutation(apiRegister, {
      onSuccess: datas => {
         if (Object.keys(datas).length > 0) setSymfonyErrors(datas)
         else window.location.href = '/'
      },
      onError: () => EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème Serveur']}])
   })

   const onSubmit = (data) => { mutate(data) }


   if (user === undefined) return <Spinner />

   else if (Object.keys(user).length > 0) window.location.href = '/'

   else return <Fader><form className={'auth-form'}>

            <h1>Inscription</h1>

            {Object.keys(symfonyErrors).length > 0 &&
               Object.keys(symfonyErrors).map((key) => (
                  <p key={uuidv4()}>{key}: {symfonyErrors[key]}</p>
               ))}


            <input
               placeholder={'Email Address'}
               {...register("email", {required: true})}
               autoComplete={'current-email'}/>
            {errors.email && <span>{errors.email.message}</span>}


            <input
               type={'password'}
               placeholder={'Mot de passe'}
               autoComplete={'current-password'}
               {...register("password", {required: true})} />
            {errors.password && <span>{errors.password.message}</span>}


            <input
               type={"submit"}
               value={'Inscription'}
               onClick={handleSubmit(onSubmit)}
               className={`btn ${!isValid || isSubmitting ? '' : 'submit-valid'}`} />

         </form></Fader>
}