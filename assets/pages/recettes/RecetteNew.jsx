import React, { useState } from "react";
import eventBus from "../../hooks/EventBus";
import { Spinner } from "../../components/Spinner";
import { useAppStore } from "../../store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { recetteSchemas } from "../../FormSchemas";
import { v4 as uuidv4 } from 'uuid';

export function RecetteNew () {
   const user = useAppStore.use.user()
   const { register, handleSubmit, formState: {errors, isSubmitting, isValid} } = useForm({
      mode: 'onBlur',
      resolver: yupResolver(recetteSchemas)
   })
   const [selectedImage, setSelectedImage] = useState(null)
   const [ingredients, setIngredients] = useState([])
   const [ingredientName, setIngredientName] = useState('')
   const [ingredientQuantity, setIngredientQuantity] = useState('')
   const [ingredientError, setIngredientError] = useState(false)

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


   const addIngredient = (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (ingredientName.length > 1 && ingredientQuantity.length > 0) {
         const ingredient = {
            name: ingredientName,
            quantity: ingredientQuantity
         }
         setIngredients(prevIngredients => {
            return [...prevIngredients, ingredient]
         })
         setIngredientName('')
         setIngredientQuantity('')
         setIngredientError(false)
      } else {
         setIngredientError(true)
      }
   };


   const deleteIngredient = (name) => {
      setIngredients(ingredients.filter(i => i.name !== name))
   };


   if (user === null) {
      return <Spinner />
   } else if (Object.keys(user).length === 0) {
      window.location = '/'
   } else {
      return (
         <><h1 style={{marginBottom: 0}}>Création d'une recette</h1>
         <form onSubmit={handleSubmit(onSubmit)} className={'recette-edit'} encType={'multipart/form-data'}>

            <label htmlFor="name">Nom de la recette</label>
            <input id={'name'} placeholder={'Nom de la recette'} {...register("name", { required: true })} />
            {errors.name && <span>{errors.name.message}</span>}


            <label htmlFor="description">Description de la recette</label>
            <input id={'description'} placeholder={'Description de la recette'} {...register("description", { required: true })} />
            {errors.description && <span>{errors.description.message}</span>}


            <label htmlFor="process">Process de la recette</label>
            <input id={"process"} placeholder={'Process de la recette'} {...register("process", { required: true })} />
            {errors.process && <span>{errors.process.message}</span>}


            <label htmlFor="duration">Durée de la recette (en minutes)</label>
            <input id={'duration'} type={'number'} placeholder={'Durée de la recette'} {...register("duration", { required: true })} />
            {errors.duration && <span>{errors.duration.message}</span>}


            <label htmlFor="more">Informations complémentaires de la recette</label>
            <input id={'more'} placeholder={'Informations complémentaires de la recette'} {...register("more", { required: true })} />
            {errors.more && <span>{errors.more.message}</span>}


            <label htmlFor="ingredients">Ingrédients de la recette</label>
            <div id={"ingredients"} className="ingredients">
               <div className="add-ingredient">
                  <input type="text" placeholder={"Nom de l'ingrédient"} value={ingredientName} onChange={e => setIngredientName(e.target.value)}/>
                  <input type="text" placeholder={"Quantité"} value={ingredientQuantity} onChange={e => setIngredientQuantity(e.target.value)}/>
                  <button className={'btn-add'} onClick={addIngredient}>+</button>
               </div>
               {ingredientError && <p>Veuillez entrer un ingrédient et une quantité valide.</p>}

               {ingredients.map(i => <p key={uuidv4()}>{i.name} ({i.quantity})
                  <button className={'btn'} onClick={() => deleteIngredient(i.name)}>X</button>
               </p>)}
            </div>

            <label htmlFor="image">Image de la recette</label>
            <input type={'file'} name={'image'} id={'image'} onChange={handleImage} />
            {selectedImage ? <img src={URL.createObjectURL(selectedImage)} alt="selected-image" /> : <p>Pas d'image sélectionnée</p>}


            <input type={"submit"} className={`btn ${!isValid || isSubmitting ? '' : 'submit-valid'}` } value={'Créer la recette'} />
         </form></>)
   }
}
