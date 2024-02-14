import React from "react";
import { Fader } from "../components/Fader";
import { Link } from "react-router-dom";

export function Home () {

   return (
      <article className={'home'}>

         <Fader>
         <h1>Découvre gratuitement toutes les recettes de la communauté Good-Food!</h1>
         <p>Crée un compte pour créer/partager tes recettes et liker/commenter celles des autres.</p>

         <nav className="start">
            <Link to={'/recettes'} className="btn">Explorer</Link>
            <Link to={'/subscribe'} className="btn">S'inscrire</Link>
         </nav>
         </Fader>

      </article>)
}