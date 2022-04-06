import React, {useState} from 'react'
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';


function SearchInput({handleSubmit}) {
  const [searchInput, setSearchInput] = useState("");
  
  
  return (
    <Form onSubmit={(event) => {event.preventDefault(); handleSubmit(searchInput)}}>
          <InputGroup className="search-account">
            <FormControl
              placeholder=".near or .testnet"
              aria-label=""
              aria-describedby=""
              onChange={(event) => {setSearchInput(event.target.value)}}
            />
            
            <Button type="submit" variant="primary" id="search-button">
              Search
            </Button>
          </InputGroup>
        </Form>
  )
}

export default SearchInput