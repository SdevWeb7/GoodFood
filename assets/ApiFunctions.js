
export const apiMe = () => {
   return fetch('/api_me', {
      method: 'POST'
   }).then(r => r.json())
}

export function apiLogin (data) {
   return fetch('/api_login', {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify(data)
   }).then(r => r.json())
}

export function apiRegister (data) {
   return fetch('/api_register', {
      method: 'POST',
      body: JSON.stringify(data)
   }).then(r => r.json())
}

export function apiContact (data) {
   return fetch('/api_contact', {
      method: 'POST',
      body: JSON.stringify(data)
   }).then(r => r.json())
}

export function apiRequestPassword (data) {
   return fetch('/reset-password', {
      method: 'POST',
      body: data.email
   }).then(r => r.json())
}
export function apiReinitPassword (data, token) {
   return fetch(`/reset-password/reset/${token}`, {
      method: 'POST',
      body: data.password
   }).then(r => r.json())
}

export function apiShowRecettes (page, perPage) {
   return fetch(`/api_recettes/${page}/${perPage}`)
      .then(r => r.json())
}

export function apiShowMesRecettes (page, perPage) {
   return fetch(`/api_mes_recettes/${page}/${perPage}`)
      .then(r => r.json())
}

export function apiShowRecette (id) {
   return fetch(`/api_recette/${id}`, {
      method: 'POST'
   }).then(r => r.json())

}

export function apiDeleteRecette (id) {
   return fetch(`/api_delete_recette/${id}`, {
      method: 'POST'
   }).then(r => r.json())
}

export function apiAddRecette (formData) {
   return fetch(`/api_add_recette`, {
      method: 'POST',
      body: formData
   }).then(r => r.json())
}

export function apiUpdateRecette (data) {
   return fetch(`/api_update_recette/${data.id}`, {
      method: 'POST',
      body: data.formData
   }).then(r => r.json())
}

export function apiComment (recetteId, comment) {
   return fetch(`/api_comment/${recetteId}`, {
      method: 'POST',
      body: comment
   }).then(r => r.json())
}

export function apiLike (recetteId) {
   return fetch(`/api_like/${recetteId}`).then(r => r.json())

}

export function apiSearchRecettes (recetteName) {
   return fetch(`/api_search_recette/${recetteName}`).then(r => r.json())
}

export function apiSearchIngredients (ingredientName) {
   return fetch(`/api_search_ingredient/${ingredientName}`).then(r => r.json())
}
