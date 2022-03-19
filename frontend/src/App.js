import './App.css';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Near Observer</h1>
      </header>

      <main>
        <InputGroup className="search-account">
          <FormControl
            placeholder="Search for account id"
            aria-label=""
            aria-describedby=""
          />
          
          <Button variant="primary" id="search-button">
            Button
          </Button>
        </InputGroup>
      </main>
    </div>
  );
}

export default App;
