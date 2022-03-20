import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import AccountInfo from './AccountInfo';
import SearchInput from './SearchInput';

function App() {
  const [account, setAccount] = useState("");

  const handleSearchSubmit = (searchInput) => {
    setAccount(searchInput);
  }


  return (
    <div className="app">
      <header className="app-header">
        <h1>Near Observer</h1>
      </header>

      <main>
        <SearchInput handleSubmit={handleSearchSubmit}/>

        <AccountInfo account={account}/>
      </main>
    </div>
  );
}

export default App;
