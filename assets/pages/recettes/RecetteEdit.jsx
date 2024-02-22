import React, { useEffect, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recetteSchemas } from "../../FormSchemas";
import { AddIngredients } from "./AddIngredients";
import { useParams } from "react-router-dom";
import EventBus from "../../hooks/EventBus";
import { Add } from "../../svg/Add";
import { useMutation, useQuery } from "react-query";
import { apiMe, apiShowRecette, apiUpdateRecette } from "../../ApiFunctions";

export function RecetteEdit () {
   const { id } = useParams()
   const { data: user } = useQuery(['user'], apiMe)
   const { data: recette } = useQuery(['recette', id], () => apiShowRecette(id))
   const { register, handleSubmit, formState: {errors, isSubmitting, isValid}, setValue } = useForm({
      mode: 'onBlur',
      resolver: yupResolver(recetteSchemas)
   })
   const { mutate } = useMutation(apiUpdateRecette, {
      onSuccess: datas => {
         if (datas.error) EventBus.emit('ToastMessage', [{type: 'error', messages: [datas.error]}])
         else window.location.href = '/mes-recettes'
      },
      onError: () => EventBus.emit('ToastMessage', [{type: 'error', messages: ['Problème Serveur']}])
   })
   const [ingredients, setIngredients] = useState([])
   const [selectedImage, setSelectedImage] = useState(null)


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
      if (selectedImage) {
         if (selectedImage.type === 'image/jpeg' || selectedImage.type === 'image/jpg' || selectedImage.type === 'image/png') {
            formData.append('image', selectedImage)
         } else {
            EventBus.emit('ToastMessage', [{type: 'error', messages: ["L'image n'est pas valide"]}])
            throw new Error('Image invalide')
         }
      }
      formData.append('recette', JSON.stringify({
         name: datas.name,
         description: datas.description,
         process: datas.process,
         duration: datas.duration,
         more: datas.more
      }))
      formData.append('ingredients', JSON.stringify(ingredients))

      mutate({id: id, formData: formData})
   };

   const handleImage = (e) => {
      setSelectedImage(e.target.files[0])
   };
   const deleteImage = (e) => {
      e.preventDefault()
      setSelectedImage(null)
   }


   if (user === undefined) return <Spinner />

   else if (Object.keys(user).length === 0) window.location = '/'

   else return <><h1 style={{marginBottom: 0}}>Edition de {recette ? recette.name : ''}</h1>

         <form
               onSubmit={handleSubmit(onSubmit)}
               className={'recette-edit'}
               encType={'multipart/form-data'}>

               <label htmlFor="name">Nom de la recette</label>
               <input
                  id={'name'}
                  placeholder={'Nom de la recette'}
                  {...register("name", { required: true })}
                  defaultValue={recette ? recette.name : ''} />
               {errors.name && <span>{errors.name.message}</span>}


               <label
                  htmlFor="description">Description de la recette</label>
               <input
                  id={'description'}
                  placeholder={'Description de la recette'}
                  {...register("description", { required: true })}
                  defaultValue={recette ? recette.description : ''} />
               {errors.description && <span>{errors.description.message}</span>}


               <label htmlFor="process">Process de la recette</label>
               <textarea
                  id={"process"}
                  placeholder={'Process de la recette'}
                  {...register("process", { required: true })}
                  defaultValue={recette ? recette.process : ''} />
               {errors.process && <span>{errors.process.message}</span>}


               <label htmlFor="duration">Durée de la recette (en minutes)</label>
               <input
                  id={'duration'}
                  type={'number'}
                  placeholder={'Durée de la recette'}
                  {...register("duration", { required: true })}
                  defaultValue={recette ? recette.duration : ''} />
               {errors.duration && <span>{errors.duration.message}</span>}


               <label htmlFor="more">Informations complémentaires de la recette</label>
               <input
                  id={'more'}
                  placeholder={'Informations complémentaires de la recette'}
                  {...register("more", { required: true })}
                  defaultValue={recette ? recette.more : ''} />
               {errors.more && <span>{errors.more.message}</span>}


               <AddIngredients
                  ingredients={ingredients}
                  setIngredients={setIngredients} />


               <label htmlFor="image">Image de la recette <Add className={'add-image'} /></label>
               <input
                  type={'file'}
                  name={'image'}
                  id={'image'}
                  onChange={handleImage} />
               {selectedImage ?
                  <><button
                     className="btn btn-del"
                     onClick={deleteImage}>Supprimer l'image</button>
                     <img
                     src={URL.createObjectURL(selectedImage)}
                     alt="selected-image" /></> :
                  <p>Pas d'image sélectionnée</p>}


               <input
                  type={"submit"}
                  className={`btn submit ${!isValid || isSubmitting ? 'btn-disabled' : ''}` }
                  value={'Modifier la recette'} />
            </form></>
}
