import './App.css';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useCallback} from 'react';
import AccountInfo from './AccountInfo';


function App() {
  const [account, setAccount] = useState("");
  const [searchAccount, setSearchAccount] = useState("");

  const handleSearchInputChange = useCallback((event) => {
    // todo don't rewrite component on every change
    setSearchAccount(event.target.value);
  })

  const handleSearchButton = (event) => {
    setAccount(searchAccount);
    event.preventDefault();
  }


  return (
    <div className="app">
      <header className="app-header">
        <h1>Near Observer</h1>
      </header>

      <main>
        <Form onSubmit={handleSearchButton}>
          <InputGroup className="search-account">
            <FormControl
              placeholder="Search for account id"
              aria-label=""
              aria-describedby=""
              onChange={handleSearchInputChange}
            />
            
            <Button type="submit" variant="primary" id="search-button">
              Search
            </Button>
          </InputGroup>
        </Form>

        <AccountInfo account={account}/>
      </main>
    </div>
  );
}

export default App = React.memo(App);
