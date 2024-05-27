import React, { Component } from 'react';
import './BookForm.css';

const createStateObj = (editingBook) => {
  return {
    title:  (editingBook && editingBook.title) || '',
    authors: (editingBook && editingBook.authors.join(', ')) || '',
    year: (editingBook && editingBook.year) || '',
    rating: (editingBook && editingBook.rating) || '',
    isbn: (editingBook && editingBook.isbn) || '',
    id: (editingBook && editingBook.id) || '',
    mode: editingBook ? 'update' : 'add',
    error: '',
  }
}

class BookForm extends Component {
  constructor(props) {
    super(props);
    const {editingBook} = props; 
    this.state = createStateObj(editingBook);
  }
  


  static getDerivedStateFromProps(nextProps, prevState) {
    const {editingBook} = nextProps; 

    const cond = editingBook && editingBook.id !== prevState.id;
    if (cond) {
      return createStateObj(editingBook)
    }
    if (cond === null && prevState.mode ==='update'){
        return createStateObj(editingBook)
      }
    return null;
  }


  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { title, authors, year, rating } = this.state;
    const  isbn = this.state.isbn.trim();
    const isbnPattern = /^$|^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/;
    if (isbn && !isbnPattern.test(isbn)) {
      this.setState({ error: 'Некорректный ISBN' });
      return;
    }
    this.setState({ error: '' });
    const book = {
      title,
      authors: authors.split(',').map(author => author.trim()),
      year: year ? parseInt(year) : null,
      rating: rating ? parseInt(rating) : 0,
      isbn: isbn || null,
    };
    if (this.state.mode === 'update') {
      this.props.updateBook(this.state.id, book);
    } else {
      this.props.addBook(book);
    }
    this.setState({ title: '', authors: '', year: '', rating: '', isbn: '' });
  };


  componentDidUpdate(){
  }
  render() {
    const { title, authors, year, rating, isbn, error, mode } = this.state;

    return (
      <form className="BookForm" onSubmit={this.handleSubmit}>
        <h2>
          {mode === 'add'? 'Создать запись' : 'Редактировать запись'}
        </h2>
        <input
          type="text"
          name="title"
          value={title}
          onChange={this.handleChange}
          placeholder="Название"
          maxLength="100"
          required
        />
        <input
          type="text"
          name="authors"
          value={authors}
          onChange={this.handleChange}
          placeholder="Авторы (через запятую)"
          required
        />
        <input
          type="number"
          name="year"
          value={year}
          onChange={this.handleChange}
          placeholder="Год публикации"
          min="1800"
        />
        <input
          type="number"
          name="rating"
          value={rating}
          onChange={this.handleChange}
          placeholder="Рейтинг"
          min="0"
          max="10"
        />
        <input
          type="text"
          name="isbn"
          value={isbn}
          onChange={this.handleChange}
          placeholder="ISBN"
        />
        {
          (error) ? (<p className="error_msg">{error}</p>) : null
        }
        
        <button type="submit">
          {
          (mode === 'update')
            ? 'Обновить'
            : 'Добавить'
          }
        </button>
        {
          (mode === 'update')
            ? <button className='cancel_btn' onClick={this.props.cancelClick}>Отмена</button>
            : null
          }
      </form>
    );
  }
}

export default BookForm;
