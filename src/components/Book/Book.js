import React, { Component } from 'react';
import './Book.css';
class Book extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book: this.props.book,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
          return {
            book: nextProps.book,
          };
      }


    render(){
        const {title, authors, year, rating, isbn, id} = this.state.book;
        return(
            <div className="book" id={this.key}>
                <div className="info">
                    <h2>{title}</h2>
                    <p>Автор(ы): {authors.join(', ')}</p>
                    {year   &&  <p>Год публикации: {year}</p>}
                    <p>Рейтинг: {rating}</p>
                    {isbn   &&  <p>ISBN: {isbn}</p>}
                </div>

                <div className="book__interaction">
                {
                    (this.props.onDeleteClick) 
                    ? (<button onClick={()=> this.props.onDeleteClick(id)}>
                        Удалить
                    </button>)
                    : null
                }
                {
                    (this.props.onUpdateClick) 
                    ? (<button className="edit_btn" onClick={()=> this.props.onUpdateClick(id)}>
                        Изменить
                    </button>)
                    : null
                }
                </div>


            </div>
        )
    }
}



export default Book;