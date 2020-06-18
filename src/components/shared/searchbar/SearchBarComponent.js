import React from 'react';
import { OutlinedInput, FormControl, InputAdornment} from '@material-ui/core';
import { SearchIcon } from '@primer/octicons-react';
import './searchbar.css';

function SearchBar(props) {
  return (
      <FormControl fullWidth variant="outlined">
        <OutlinedInput className="search-bar"
          startAdornment={
            <InputAdornment position="start">
            <SearchIcon className="search-icon"/>
            </InputAdornment>
          }
          placeholder="search"
        />
      </FormControl>
  );
}

export default SearchBar;
