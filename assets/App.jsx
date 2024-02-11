import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppStore } from "./store";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Layout } from "./pages/Layout";
import { Contact } from "./pages/Contact";
import { Subscribe } from "./pages/Subscribe";
import { Login } from "./pages/Login";
import { ResetPassword } from "./pages/ResetPassword";
import { ReinitPassword } from "./pages/ReinitPassword";
import { Recettes } from "./pages/recettes/Recettes";
import { MesRecettes } from "./pages/recettes/MesRecettes";
import { RecetteDetails } from "./pages/recettes/RecetteDetails";
import { RecetteEdit } from "./pages/recettes/RecetteEdit";

function App () {

   const updateUser = useAppStore.use.updateUser()

   useEffect(() => {
      fetch('/api_me').then(r => r.json()).then(d => updateUser(d))
   }, [])

   return (
      <BrowserRouter>
         <Routes>
            <Route path={'/'} element={<Layout />}>
               <Route path={'/'} element={<Home />} />
               <Route path={'/:token'} element={<ReinitPassword />} />
               <Route path={'/subscribe'} element={<Subscribe />} />
               <Route path={'/login'} element={<Login />} />
               <Route path={'/reset-password'} element={<ResetPassword />} />
               <Route path={'/contact'} element={<Contact />} />
               <Route path={'/recettes'} element={<Recettes />} />
               <Route path={'/mes-recettes'} element={<MesRecettes />} />
               <Route path={'/recette/:id'} element={<RecetteDetails />} />
               <Route path={'/recette/editer/:name'} element={<RecetteEdit />} />
               <Route path={'/*'} element={<NotFound />} />
            </Route>

         </Routes>
      </BrowserRouter>
   )
}
export default App;