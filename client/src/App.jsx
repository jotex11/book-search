import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Create an Apollo Client instance
const client = new ApolloClient({
  uri: authLink.concat(HttpLink), 
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <>
          <Navbar />
          <Outlet />
        </>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
