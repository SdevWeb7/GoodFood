import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchemas } from "../FormSchemas";
import EventBus from "../hooks/EventBus";
import { Spinner } from "../components/Spinner";
import { Fader } from "../components/Fader";
import { NavLink } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiLogin, apiMe } from "../ApiFunctions";

export function Login () {

   const { data: user } = useQuery(['user'], () => apiMe())
   const [symfonyError, setSymfonyError] = useState('')
   const {register, handleSubmit,
      formState: {isValid, isSubmitting, errors}} = useForm({
         mode: 'onBlur',
         resolver: yupResolver(loginSchemas)
   })
   const queryClient = useQueryClient()
   const { mutate } = useMutation(apiLogin, {
      onSuccess: datas => {
         if (datas.error) setSymfonyError(datas.error)
         else window.location.href = '/'
      },
      onError: (err, _, context) => EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème Serveur']}])
   })

   const onSubmit = (data) => { mutate(data) }


   if (user === undefined) return <Spinner />

   else if (Object.keys(user).length > 0) window.location = '/'

   else return <Fader><form className={'auth-form'}>
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

         </form></Fader>

}
