import React, { useState } from "react";
import { SearchIcon } from "../svg/SearchIcon";
import { SearchBar } from "./SearchBar";

export function Search () {
   const [openSearch, setOpenSearch] = useState(false)


   let handleOpen = (e) => {
      e.preventDefault()
      e.stopPropagation()
      setOpenSearch(v => !v)
   };


   return (
      <>
         <SearchIcon
            className={'search-icon'}
            onClick={handleOpen} />

         {openSearch &&
            <SearchBar setSearchOpen={setOpenSearch} />}
      </>
   )
}