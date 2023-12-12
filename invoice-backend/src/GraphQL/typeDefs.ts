const typeDefs = `

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: String!
    genres: [String!]!
  }

  type Author {
  name: String!
  id: String!
  born: Int,
  bookCount: Int
 }

 type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
  ): Book

  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author

  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token

}

 type Subscription {
    bookAdded: Book!
    }

 type Query {
   bookCount: Int!
   authorCount: Int!,
   author: Author!
   allBooks(author: String, genre: String): [Book]!
   allAuthors: [Author!]!
   me: User
 }
 
 type Query {
   allInvoices: [Invoice]
 }

  type Invoice {
    clientAddress: ClientAddress,
    clientEmail: String,
    clientName: String,
    createdAt: String,
    description: String,
    id: String,
    items: [Item],
    paymentDue: String,
    paymentTerms: Float,
    senderAddress: SenderAddress,
    status: String,
    total: Float
}


type SenderAddress {
    city: String,
    country: String,
    postCode: String
    street: String
}

type ClientAddress {
    city: String,
    country: String,
    postCode: String
    street: String
}

type Item {
    id: String,
    name: String
    price: Float,
    quantity: Int,
    total: Float
}
`;

export default typeDefs;
