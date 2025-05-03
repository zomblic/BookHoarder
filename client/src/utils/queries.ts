import { gql } from '@apollo/client';

export const searchGoogleBooks = (query: string) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
};

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const GET_USERS = gql`
  query users { 
    users {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
