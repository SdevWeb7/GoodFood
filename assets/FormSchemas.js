import * as yup from 'yup'

const emailPhrase = 'Veuillez entrer une adresse email valide.';
const passPhrase = 'Veuillez entrer un mot de passe valide (minimum six caractères).';
const messagePhrase = 'Veuillez entrer un message valide.';
const passPhrase2 = 'Les deux mots de passes doivent correspondre.';
const namePhrase = 'Veuillez entrer un nom valide.';
const descriptionPhrase = 'Veuillez entrer une description valide.';
const processPhrase = 'Le process n\'est pas valide.';
const durationPhrase = 'La durée n\'est pas valide.';
const ingredientsPhrase = 'Il faut des ingrédients.';
const morePhrase = 'Les informations complémentaires ne sont pas valide.';
const ingredientNamePhrase = "Le nom de l'ingrédient n'est pas valide.";
const ingredientQuantityPhrase = 'La quantité de l\'ingrédient n\'est pas valide.';

export const registerSchemas = yup.object().shape({
   email: yup.string().email(emailPhrase).required(emailPhrase).typeError(emailPhrase),
   password: yup.string().required(passPhrase).min(6, passPhrase).typeError(passPhrase)
})

export const loginSchemas = yup.object().shape({
   username: yup.string().email(emailPhrase).required(emailPhrase).typeError(emailPhrase),
   password: yup.string().required(passPhrase).min(6, passPhrase).typeError(passPhrase)
})

export const resetPasswordSchema = yup.object().shape({
   email: yup.string().email(emailPhrase).required(emailPhrase).typeError(emailPhrase)
})
export const reinitPasswordSchema = yup.object().shape({
   password: yup.string().required(passPhrase).min(6, passPhrase).typeError(passPhrase),
   password2: yup.string().required(passPhrase).oneOf([yup.ref('password'), null], passPhrase2).typeError(passPhrase)
})

export const contactSchema = yup.object().shape({
   email: yup.string().email(emailPhrase).required(emailPhrase).typeError(emailPhrase),
   message: yup.string().required(messagePhrase).min(6).max(500).typeError(messagePhrase)
})


export const recetteSchemas = yup.object().shape({
   name: yup.string().required(namePhrase).typeError(namePhrase),
   description: yup.string().required(descriptionPhrase).typeError(descriptionPhrase),
   process: yup.string().required(processPhrase).typeError(processPhrase),
   duration: yup.number().required(durationPhrase).typeError(durationPhrase),
   more: yup.string().required(morePhrase).typeError(morePhrase),
   // ingredients: yup.array().required(ingredientsPhrase).typeError(ingredientsPhrase),
   // ingredientName: yup.string().required(ingredientNamePhrase).typeError(ingredientNamePhrase),
   // ingredientQuantity: yup.string().required(ingredientNamePhrase).typeError(ingredientNamePhrase)
})