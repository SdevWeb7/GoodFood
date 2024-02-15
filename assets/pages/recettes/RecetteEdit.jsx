import React, { useEffect, useState } from "react";
import eventBus from "../../hooks/EventBus";
import { Spinner } from "../../components/Spinner";
import { useAppStore } from "../../store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recetteSchemas } from "../../FormSchemas";
import { AddIngredients } from "./AddIngredients";
import { useParams } from "react-router-dom";

export function RecetteEdit () {
   const { id } = useParams()
   const user = useAppStore.use.user()
   const [recette, setRecette] = useState({})
   const { register, handleSubmit, formState: {errors, isSubmitting, isValid}, setValue } = useForm({
      mode: 'onBlur',
      resolver: yupResolver(recetteSchemas)
   })
   const [ingredients, setIngredients] = useState([])
   const [selectedImage, setSelectedImage] = useState(null)


   useEffect(() => {
      if (user && user.recettes) {
         setRecette(
            user.recettes.filter(r => r.id == id)[0])
      }
   }, [])

   useEffect(() => {
      if (recette) {
         setIngredients(recette.ingredients)
         setValue('name', recette.name)
         setValue('description', recette.description)
         setValue('process', recette.process)
         setValue('duration', recette.duration)
         setValue('more', recette.more)

         if (recette.image) {
            fetch(`/images/recettes/${recette.image}`)
               .then(r => r.blob())
               .then(b => setSelectedImage(
                  new File([b], 'image.png', {type: 'image/png'})))

         }
      }
   }, [recette])

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

      fetch(`/api_update_recette/${id}`, {
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
         <><h1 style={{marginBottom: 0}}>Edition de {recette ? recette.name : ''}</h1>
            <form
               onSubmit={handleSubmit(onSubmit)}
               className={'recette-edit'}
               encType={'multipart/form-data'}>

               <label htmlFor="name">Nom de la recette</label>
               <input
                  id={'name'}
                  placeholder={'Nom de la recette'}
                  {...register("name", { required: true })}
                  defaultValue={recette.name} />
               {errors.name && <span>{errors.name.message}</span>}


               <label
                  htmlFor="description">Description de la recette</label>
               <input
                  id={'description'}
                  placeholder={'Description de la recette'}
                  {...register("description", { required: true })}
                  defaultValue={recette.description} />
               {errors.description && <span>{errors.description.message}</span>}


               <label htmlFor="process">Process de la recette</label>
               <input
                  id={"process"}
                  placeholder={'Process de la recette'}
                  {...register("process", { required: true })}
                  defaultValue={recette.process} />
               {errors.process && <span>{errors.process.message}</span>}


               <label htmlFor="duration">Durée de la recette (en minutes)</label>
               <input
                  id={'duration'}
                  type={'number'}
                  placeholder={'Durée de la recette'}
                  {...register("duration", { required: true })}
                  defaultValue={recette.duration} />
               {errors.duration && <span>{errors.duration.message}</span>}


               <label htmlFor="more">Informations complémentaires de la recette</label>
               <input
                  id={'more'}
                  placeholder={'Informations complémentaires de la recette'}
                  {...register("more", { required: true })}
                  defaultValue={recette.more} />
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
                     alt="selected-image" /></> :
                  <p>Pas d'image sélectionnée</p>}


               <input
                  type={"submit"}
                  className={`btn ${!isValid || isSubmitting ? 'btn-disabled' : ''}` }
                  value={'Modifier la recette'} />
            </form></>)
   }
}
