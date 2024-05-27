import React, {Component} from "react";
import Book from '../Book/Book';
import './BooksGroup.css';

class BooksGroup extends Component {
    constructor(props) {
        super(props);
        this.deleteBook = this.props.deleteBook;
        this.editBook = this.props.editBook;
        this.state = {
            groupedBooks: this.props.groupedBooks,
            groupKey: this.props.groupKey
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            groupedBooks: nextProps.groupedBooks,
            groupKey: nextProps.groupKey
        };
    }

    render(){
        const {groupedBooks, groupKey} = this.state;
        return(
            <>
                {(groupKey !== undefined)
                ?
                (<>
                    <h1>{groupKey}</h1>
                    <div className="books__container">
                        {
                        (groupedBooks[groupKey].length !== 0) 
                        ? groupedBooks[groupKey].map(book => 
                            <Book book={book}  onDeleteClick={this.deleteBook} onUpdateClick={this.editBook} key={book.id}/>) 
                        : (<p className="alert">Книги не найдены</p>)
                        }
                    </div>
                    </>)
                : null}
            </>
        )
    }
}

export default BooksGroup;