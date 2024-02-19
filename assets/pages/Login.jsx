import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchemas } from "../FormSchemas";
import EventBus from "../hooks/EventBus";
import { useAppStore } from "../store";
import { Spinner } from "../components/Spinner";
import { Fader } from "../components/Fader";
import { NavLink } from "react-router-dom";

export function Login () {

   const user = useAppStore.use.user()
   const [symfonyError, setSymfonyError] = useState('')
   const {register, handleSubmit,
      formState: {isValid, isSubmitting, errors}} = useForm({
         mode: 'onBlur',
         resolver: yupResolver(loginSchemas)
   })

   const onSubmit = (data) => {
      fetch('/api_login', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      }).then(r => {
         if (!r.ok && r.status !== 401) {
            EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème serveur']}])
         }
         return r.json()
      }).then(d => {
         if (Object.keys(d).length > 0) {
            setSymfonyError(d.error)
         } else {
            window.location.href = '/'
         }
      })
   }


   if (user === null) {
      return <Spinner />
   } else if (Object.keys(user).length > 0) {
      window.location = '/'
   } else {

      return (<Fader>
         <form className={'auth-form'}>
            <h1>Connexion</h1>

            {symfonyError.length > 1 && <p>{symfonyError}</p>}

            <input
               placeholder={'Email Address'}
               autoComplete={'current-email'}
               {...register("username", { required: true })} />
            {errors.username && <span>{errors.username.message}</span>}


            <input
               type={'password'}
               placeholder={'Mot de passe'}
               autoComplete={'current-password'}
               {...register("password", { required: true })} />
            {errors.password && <span>{errors.password.message}</span>}


            <input
               type={"submit"}
               className={`btn ${!isValid || isSubmitting ? '' : 'submit-valid'}`}
               onClick={handleSubmit(onSubmit)}
               value={'Connexion'} />

            <NavLink
               to={"/reset-password"}
               className={'reset-pass'}>
               Mot de passe oublié</NavLink>

         </form></Fader>)
   }

}
