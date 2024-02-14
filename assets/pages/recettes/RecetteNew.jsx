import React, { useState } from "react";
import eventBus from "../../hooks/EventBus";
import { Spinner } from "../../components/Spinner";
import { useAppStore } from "../../store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recetteSchemas } from "../../FormSchemas";
import { AddIngredients } from "./AddIngredients";

export function RecetteNew () {
   const user = useAppStore.use.user()
   const { register, handleSubmit, formState: {errors, isSubmitting, isValid} } = useForm({
      mode: 'onBlur',
      resolver: yupResolver(recetteSchemas)
   })
   const [selectedImage, setSelectedImage] = useState(null)
   const [ingredients, setIngredients] = useState([])


   const onSubmit = (datas) => {
      const formData = new FormData()
      formData.append('recette', JSON.stringify({
         name: datas.name,
         description: datas.description,
         process: datas.process,
         duration: datas.duration,
         more: datas.more
      }))
      formData.append('image', selectedImage)
      formData.append('ingredients', JSON.stringify(ingredients))

      fetch('/api_add_recette', {
         method: 'POST',
         body: formData
      }).then(r => {
         if (!r.ok) {
            eventBus.emit('ToastMessage', [{type: 'error', messages: ['erreur']}])
            throw new Error('Problème serveur')
         }
         return r.json()
      }).then(datas => {
         if (datas.error) {
            eventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
            throw new Error(datas.error)
         }
         if (Object.entries(datas).length === 0) {
            window.location = '/mes-recettes'
         }
         })
         .catch(e => console.log(e))
   };
   const handleImage = (e) => {
      setSelectedImage(e.target.files[0])
   };
   const deleteImage = (e) => {
      e.preventDefault()
      setSelectedImage(null)
   }


   if (user === null) {
      return <Spinner />
   } else if (Object.keys(user).length === 0) {
      window.location = '/'
   } else {
      return (
         <><h1 style={{marginBottom: 0}}>Création d'une recette</h1>
         <form
            onSubmit={handleSubmit(onSubmit)}
            className={'recette-edit'}
            encType={'multipart/form-data'}>

            <label htmlFor="name">Nom de la recette</label>
            <input
               id={'name'}
               placeholder={'Nom de la recette'}
               {...register("name", { required: true })} />
            {errors.name && <span>{errors.name.message}</span>}


            <label
               htmlFor="description">Description de la recette</label>
            <input
               id={'description'}
               placeholder={'Description de la recette'}
               {...register("description", { required: true })} />
            {errors.description && <span>{errors.description.message}</span>}


            <label htmlFor="process">Process de la recette</label>
            <input
               id={"process"}
               placeholder={'Process de la recette'}
               {...register("process", { required: true })} />
            {errors.process && <span>{errors.process.message}</span>}


            <label htmlFor="duration">Durée de la recette (en minutes)</label>
            <input
               id={'duration'}
               type={'number'}
               placeholder={'Durée de la recette'}
               {...register("duration", { required: true })} />
            {errors.duration && <span>{errors.duration.message}</span>}


            <label htmlFor="more">Informations complémentaires de la recette</label>
            <input
               id={'more'}
               placeholder={'Informations complémentaires de la recette'}
               {...register("more", { required: true })} />
            {errors.more && <span>{errors.more.message}</span>}


            <AddIngredients ingredients={ingredients} setIngredients={setIngredients} />


            <label htmlFor="image">Image de la recette</label>
            <input
               type={'file'}
               name={'image'}
               id={'image'}
               onChange={handleImage} />
            {selectedImage ?
               <><button
                  className="btn btn-del"
                  onClick={deleteImage}>X</button>
               <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="selected-image" /></> : <p>Pas d'image sélectionnée</p>}


            <input
               type={"submit"}
               className={`btn ${!isValid || isSubmitting ? 'btn-disabled' : ''}` }
               value={'Créer la recette'} />
         </form></>)
   }
}
