const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [BookDocument]!
    bookCount: Int
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    savedBooks: [BookInput]
  }

  type BookDocument {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  input BookInput {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    user(username: String!): User
    me: User
  }

  type Mutation {
    createUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    deleteBook(bookId: ID!): User
  }
`;

export default typeDefs;