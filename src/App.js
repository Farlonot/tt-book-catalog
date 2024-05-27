import React, {Component}  from 'react';
import './App.css';
import BookCatalog from './components/BookCatalog/BookCatalog';
import Header from './components/Header/Header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <BookCatalog />
      </div>
    );
  }
}

export default App;
