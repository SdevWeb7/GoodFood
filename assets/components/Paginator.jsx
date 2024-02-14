import React from "react";

export function Paginator ({page, setPage, nombrePages}) {

   return (
      <nav className="pagination">
         {page > 1 &&
            <><button
               className={'btn'}
               onClick={() => setPage(1)}>
               Première Page</button>

               <button
                  className={'btn'}
                  onClick={() => setPage(p => p > 1 ? p - 1 : p)}>
                  Page Précédente</button></>}


         {page < nombrePages &&
            <><button
               className={'btn'}
               onClick={() => setPage(p => p < nombrePages ? p + 1 : nombrePages)}>
               Page Suivante</button>

               <button
                  className={'btn'}
                  onClick={() => setPage(nombrePages)}>
                  Dernière Page</button></>}
      </nav>
   )
}