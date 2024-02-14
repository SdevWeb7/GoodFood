import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function AddIngredients ({ingredients, setIngredients}) {
   const [ingredientName, setIngredientName] = useState('')
   const [ingredientQuantity, setIngredientQuantity] = useState('')
   const [ingredientError, setIngredientError] = useState(false)

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

   return (
      <><label htmlFor="ingredients">Ingrédients de la recette</label>

      <div id={"ingredients"} className="ingredients">
         <div className="add-ingredient">
            <input
               type="text"
               placeholder={"Nom de l'ingrédient"}
               value={ingredientName}
               onChange={e => setIngredientName(e.target.value)}/>


            <input
               type="text"
               placeholder={"Quantité"}
               value={ingredientQuantity}
               onChange={e => setIngredientQuantity(e.target.value)}/>


            <button
               className={'btn btn-add'}
               onClick={addIngredient}>+</button>
         </div>

         {ingredientError && <p>Veuillez entrer un ingrédient et une quantité valide.</p>}

         {ingredients && ingredients.map(i =>
            <p key={uuidv4()}>
               {i.quantity} {i.name}
               <button
                  className={'btn'}
                  onClick={() => deleteIngredient(i.name)}>X</button></p>)}
      </div></>)
}