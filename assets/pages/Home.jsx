import React from "react";
import { Fader } from "../components/Fader";
import { Link } from "react-router-dom";

export function Home () {

   return (
      <section className={'home'}>

         <Fader><h1>Découvre gratuitement toutes les recettes de la communauté Good-Food!</h1>

         <h2>Crée un compte pour créer/partager tes recettes et liker/commenter celles des autres.</h2>

         <nav className="start">
            <Link
               to={'/recettes'}
               className="btn">Explorer</Link>
            <Link
               to={'/subscribe'}
               className="btn">S'inscrire</Link>
         </nav></Fader>

      </section>)
}