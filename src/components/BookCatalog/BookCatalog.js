import React, { Component } from 'react';
import { db } from '../../firebase';
import {collection, doc, getDocs, addDoc, deleteDoc, updateDoc} from 'firebase/firestore';
import BookForm from '../BookForm/BookForm';
import BookGroup from '../BooksGroup/BooksGroup';
import Book from '../Book/Book';
import ModeSelection from '../ModeSelection/ModeSelection';
import './BookCatalog.css';



class BookCatalog extends Component {

  constructor(props){
    super(props)
    this.collectionName = 'books';
    this.groupingModes = ['year', 'rating', 'author'];
    this.noYearString = 'Книги без указания года'
    this.state = {
      books: [],
      recommendedBook: null,
      editingBook: null,
      groupingMode: this.groupingModes[0],
    };
  }

  getBooks(){
    const colRef = collection(db, this.collectionName);
    getDocs(colRef)
      .then((snapshot) => {
        const books = []
        snapshot.docs.forEach((doc) =>{
            books.push({...doc.data(), id: doc.id})
          })
          this.setState({ books,   editingBook: null }, this.findRecommendedBook);
      })
      .catch(err=>{
        this.setState({ books: [] });
          console.log(err.message);
        }
      );
  }

  findRecommendedBook(){
    const { books } = this.state;
    const oldBooks = books.filter(book => (new Date().getFullYear() - book.year) >= 3);
    const highestRate = oldBooks.reduce((prev, cur) =>(+cur.rating > +prev.rating) ? cur : prev);
    const highestRatedBooks = oldBooks.filter(book => book.rating >= highestRate.rating);
    const recommendedBook = highestRatedBooks[Math.floor(Math.random() * highestRatedBooks.length)];
    this.setState({ recommendedBook });
  }
  
  addBook = async (book) => {
    const booksCollection = collection(db, this.collectionName);
    addDoc(booksCollection, book)
    .then(() => this.getBooks())
    .catch(error => console.log);
  };

  deleteBook = async (id) => {
    const bookDoc = doc(db, this.collectionName, id);
    deleteDoc(bookDoc)
    .then(() => this.getBooks())
    .catch(error => console.log(error.message));
  };

  updateBook = async (id, updatedBook) => {
    const bookDoc = doc(db, 'books', id);
    await updateDoc(bookDoc, updatedBook);
    this.getBooks();
  };

  changeGroupingModeClickHandler = (mode) => {
    this.setState({ groupingMode: mode });
  }

  editBookClickHandler = (id) => {
    const editingBook = this.state.books.find(book => book.id === id);
    this.setState({ editingBook });
  };
  cancelClickHandler = () => {
    this.setState({ editingBook: null });
  };


  groupBooksByFunc(books, func){
    return books.reduce((acc, book) =>{
      const key = func(book);
      if (!acc[key]) 
        acc[key] = [];
      acc[key].push(book);
      return acc;
    }, {});
  }


  getGroupingHelpers = () => {
    const getBookYear = (book) => book.year || this.noYearString;
    const getBookRating = (book) => book.rating;
    const getBookAuthors = (book) => book.authors[0];

    if (this.state.groupingMode === 'year'){
      return [getBookYear, this.cmpYear]
    }
    if (this.state.groupingMode === 'rating'){
      return [getBookRating, this.cmpNum]
    }
    if (this.state.groupingMode === 'author'){
      return [getBookAuthors, this.cmpStr]
    }
  }

  cmpStr = (a, b) => a.localeCompare(b)
  cmpNum = (a, b) => (+b)-(+a)
  cmpYear = (a, b) => {
    if (a === this.noYearString) return 1;
    if (b === this.noYearString) return -1;
    return b - a;
  }

  getSortedKeys = (groupedBooks, pred) =>  Object.keys(groupedBooks).sort(pred);

  componentDidMount() {
    this.getBooks();
  }

  render(){
    const {books, recommendedBook, editingBook, groupingMode} = this.state;
    const [getKey, cmpFunc] = this.getGroupingHelpers();
    const groupedBooks = this.groupBooksByFunc(books, getKey)
    const sortedKeys = this.getSortedKeys(groupedBooks, cmpFunc);
    sortedKeys.forEach(key => {
      groupedBooks[key].sort((a, b) => a.title.localeCompare(b.title));
    });
    return(
      <>
        <div className="BookCatalog">
          <div className="section">
            <h1>Рекомендуемая Книга:</h1>
            {
              recommendedBook ? (<Book book={recommendedBook} key="rec"/>) 
              : (<p className="alert">Рекомендованные книги не найдены</p>)
            }
          </div>
          <ModeSelection text="Группировка:" onClick={this.changeGroupingModeClickHandler} modes={this.groupingModes} curMode={groupingMode}/>
          {
            (sortedKeys)
            ? (sortedKeys.map(key => (
              <div className="section" key={key}>
                <BookGroup groupKey={key} groupedBooks={groupedBooks} deleteBook={this.deleteBook} editBook={this.editBookClickHandler} />
              </div>)))
              :null
          }

          
        </div>
        <BookForm addBook={this.addBook} updateBook={this.updateBook} editingBook={editingBook} cancelClick={this.cancelClickHandler}/>
      </>
    )
  }
}

export default BookCatalog;
