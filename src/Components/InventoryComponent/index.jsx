import React, { useState, useEffect } from "react";
import { Table, Menu, Button, Grid, Input, Header, Icon, Modal } from 'semantic-ui-react';
import { getBooks, searchBooks, addBook, deleteBook } from "./service";
import styles from './styles.css';

export default function Inventory() {
    const [books, setBooks] = useState([]);
    const [results, setResults] = useState([]);
    const [searchBook, setSearchBook] = useState("");
    const [open, setOpen] = useState(null)

    useEffect(() => {
        fetchBooks()
    }, [])

    const fetchBooks = async () => {
        const fetchedBooks = await getBooks();
        setBooks(fetchedBooks);
    }
    const findBooks = async () => {
        if (searchBook?.trim()) {
            const bookResults = await searchBooks({ bookName: searchBook?.trim() });
            setResults(bookResults);
        } else {
            setResults([]);
        }
    }

    const addSearchBook = async (book) => {
        setBooks([...books, book]);
        await saveBook(book);
    }

    const checkTitle = (title) => {
        return !books.find(book => book.book_name?.trim().toLowerCase() == title?.trim().toLowerCase());
    }

    const updateQuantity = e => {
        const booksCopy = [...books];
        booksCopy[open].quantity = e.target.value;
        setBooks(booksCopy)
    }

    const saveBook = async book => {
        const updatedBook = await addBook(book);
        const booksCopy = [...books];
        booksCopy[open] = updatedBook;
        setBooks(booksCopy)
        setOpen(null)
    }

    const removeBook = async () => {
        const booksCopy = [...books];
        booksCopy.splice(open, 1);
        setBooks(booksCopy);
        setOpen(null)
        await deleteBook({ bookId: books[open]?._id });
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Header icon>
                    Inventory Books
                </Header>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Book Name</Table.HeaderCell>
                            <Table.HeaderCell>Author</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>edit</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {books.map((book, index) =>
                        (<Table.Row key={book._id}>
                            <Table.Cell>{book.book_name}</Table.Cell>
                            <Table.Cell>{book.author?.toString()}</Table.Cell>
                            <Table.Cell>{book.quantity || "01"}</Table.Cell>
                            <Table.Cell><Button onClick={e => setOpen(index)}>edit</Button></Table.Cell>
                        </Table.Row>),
                        )}
                    </Table.Body>
                </Table>
            </Grid.Column>
            <Grid.Column width={6}>
                <Input focus placeholder='Search...' onChange={e => setSearchBook(e.target.value)} />
                <Button onClick={findBooks}>Search</Button>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Book Name</Table.HeaderCell>
                            <Table.HeaderCell>Author</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {results.map((result, index) =>
                        (<Table.Row key={index}>
                            <Table.Cell>{result.volumeInfo?.title}</Table.Cell>
                            <Table.Cell>{result.volumeInfo?.authors?.toString()}</Table.Cell>
                            <Table.Cell>{checkTitle(result.volumeInfo?.title) ?
                                < Button onClick={(e) => addSearchBook({
                                    book_name: result.volumeInfo?.title, author: result.volumeInfo?.authors, google_id: result.id
                                })}>+</Button> : "Present"}
                            </Table.Cell>
                        </Table.Row>),
                        )}
                    </Table.Body>
                </Table>
            </Grid.Column>
            <Modal
                basic
                onClose={() => setOpen(null)}
                onOpen={() => setOpen(true)}
                open={open !== null}
                size='small'
            >
                <Header icon>
                    <Icon name='archive' />
                     Edit Book in the Inventory
                </Header>
                <Modal.Content>
                    <p>
                        Book Name: {books[open]?.book_name}
                    </p>
                    <p>
                        Book Authors: {books[open]?.author?.toString()}
                    </p>
                    <p>
                        Google Id: {books[open]?.google_id}
                    </p>
                    <p>
                        Quantity:
                        <Input value={Number(books[open]?.quantity) || 1} type="number" onChange={updateQuantity} />
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='red' inverted onClick={() => setOpen(null)}>
                        <Icon name='remove' /> Cancel
                    </Button>
                    <Button basic color='blue' inverted onClick={removeBook}>
                        <Icon name='remove' /> Delete
                    </Button>
                    <Button color='green' inverted onClick={() => saveBook(books[open])}>
                        <Icon name='checkmark' /> Save
                    </Button>
                </Modal.Actions>
            </Modal>
        </Grid >
    );
}