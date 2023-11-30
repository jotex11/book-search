import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row,
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { getSavedBookIds, saveBookIds } from '../utils/localStorage';
import { GET_ME, REMOVE_BOOK, SEARCH_BOOKS } from '../utils/graphql'; // Import your GraphQL queries and mutations

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const { data: userData } = useQuery(GET_ME); // Execute the GET_ME query using useQuery

  const [removeBook] = useMutation(REMOVE_BOOK); // Use the useMutation hook for REMOVE_BOOK mutation

  const { loading, error, data: searchedBooksData, refetch } = useQuery(SEARCH_BOOKS, {
    variables: { searchInput }, // Pass searchInput as variables for the SEARCH_BOOKS query
    skip: !searchInput, // Skip query if searchInput is empty
  });

  const searchedBooks = searchedBooksData?.searchBooks || [];

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) {
      return false;
    }
    // Refetch the SEARCH_BOOKS query with the updated searchInput
    await refetch({ searchInput });
  };

  const handleSaveBook = async (bookId) => {
    // Check if user is logged in
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    // Extract the book details from searchedBooks using bookId
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const bookData = items.map((book) => ({
      bookId: book.id,
      authors: book.volumeInfo.authors || ["No author to display"],
      title: book.volumeInfo.title,
      description: book.volumeInfo.description,
      image: book.volumeInfo.imageLinks?.thumbnail || "",
    }));
};
    // Update savedBookIds state upon successful save
    if (data?.saveBook) {
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    };


  const handleDeleteBook = async (bookId) => {
    try {
      const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
      // Update savedBookIds state upon successful removal
      if (data?.removeBook) {
        const updatedSavedBookIds = savedBookIds.filter((id) => id !== bookId);
        setSavedBookIds(updatedSavedBookIds);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className="btn-block btn-info"
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? "This book has already been saved!"
                        : "Save this Book!"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );

export default SearchBooks;
