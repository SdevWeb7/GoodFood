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


   return (<>
      <a
         href={'#'}
         onClick={e => e.preventDefault()}
         className={'search-icon'}
         onClick={handleOpen}>

         <SearchIcon />
      </a>

      {openSearch &&
         <SearchBar setSearchOpen={setOpenSearch} />}</>)
}