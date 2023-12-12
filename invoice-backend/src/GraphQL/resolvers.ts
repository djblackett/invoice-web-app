import {prisma} from "../../index";
// import {PrismaClient} from "@prisma/client";
import {getPrismaClient} from "@prisma/client/runtime/library";
import {PrismaClient} from "@prisma/client";

//
// const { GraphQLError } = require("graphql/error");
// const User = require("../Models/User");
// const jwt = require("jsonwebtoken");
// const { PubSub } = require("graphql-subscriptions");
// const pubsub = new PubSub();
// import Context from "graphql-ws";

interface PrismaContext {
  prisma: PrismaClient
}

// getPrismaClient(  )


// @ts-ignore
const resolvers = {
  Query: {
    allInvoices: async (_parent: any, _args: any, context: PrismaContext) => {
      try {

        console.log("context:", context);
        // console.log("context.prisma:", context.prisma);
        const response = await prisma.invoice.findMany({
          include: {
            items: true,
            clientAddress: true,
            senderAddress: true
          }
        });
        console.log("response:", response);
        // console.log(response[0].clientAddress);
        return response;
      } catch (error) {
        console.error(error);
        return error;
      }
    }
  }


  // Query: {
  //   author: async (authorId) => Author.findById(authorId).exec(),
  //   bookCount: () => Book.collection.countDocuments(),
  //   authorCount: () => Author.collection.countDocuments(),
  //   allBooks: async (_, { author, genre },) => {
  //
  //     if (!author && !genre) {
  //       console.log("No params:");
  //       const booksNoParams = await Book.find({}).populate("author").exec();
  //       // console.log(booksNoParams);
  //       return booksNoParams;
  //     } else if (!genre) {
  //       console.log("Author no genre");
  //       const getAuthor = await Author.findOne({ name: author }).exec();
  //       const authorBooks = await Book.find({ author: getAuthor }).populate("author").exec();
  //       // console.log(authorBooks);
  //       return authorBooks;
  //     } else if (!author) {
  //       console.log("In the genre filter");
  //       const filteredByGenre = await Book.find({ genres: genre }).populate("author").exec();
  //       // console.log(filteredByGenre);
  //       return filteredByGenre;
  //     }
  //
  //     const getAuthor = await Author.findOne({ name: author }).exec();
  //     return Book.find({ author: getAuthor, genres: genre }).populate("author").exec();
  //   },
  //   allAuthors: async () => {
  //     // The n + 1 problem is avoided by querying for all th authors and books
  //     // and then constructing the book count from those 2 results
  //     const authorsArr = await Author.find().exec();
  //     const booksArr = await Book.find().exec();
  //
  //     console.log("all authors query called");
  //
  //     const result = authorsArr.map(author => {
  //       // console.log(author);
  //
  //       const authorBookCount = booksArr.filter(book => {
  //         return book.author.toString() === author.id.toString();
  //       });
  //
  //       // console.log("authorBookCount:", authorBookCount);
  //       return { id: author.id, name: author.name, born: author.born, bookCount: authorBookCount.length };
  //     });
  //     return result;
  //   },
  //   me: (root, args, context) => context.currentUser
  //
  // },
  // Mutation: {
  //   addBook: async (root, args, context) => {
  //
  //     console.log(context);
  //     if (!context.currentUser) {
  //       throw new GraphQLError("User must be logged in to add book");
  //     }
  //
  //     if (args.title.length < 2) {
  //       throw new GraphQLError("Title must be longer than one character", {
  //         extensions: {
  //           code: "BAD_USER_INPUT",
  //           invalidArgs: args.title
  //         }
  //       });
  //     }
  //
  //     const book = await Book.findOne({ title: args.title });
  //     // console.log("After book definition");
  //     if (book) {
  //       // console.log("book exists");
  //       throw new GraphQLError("Name must be unique", {
  //         extensions: {
  //           code: "BAD_USER_INPUT",
  //           invalidArgs: args.title
  //         }
  //       });
  //     }
  //
  //     if (args.author.length < 3) {
  //       throw new GraphQLError("Authors name must be at least 3 characters", {
  //         extensions: {
  //           code: "BAD_USER_INPUT",
  //           invalidArgs: args.author
  //         }
  //       });
  //     }
  //     const author = await Author.findOne({ name: args.author });
  //     // console.log(author);
  //
  //     let newBook;
  //
  //     try {
  //       if (!author) {
  //         const newAuthor = await new Author({ name: args.author });
  //         // console.log(newAuthor);
  //         const savedAuthor = await newAuthor.save();
  //         // console.log(savedAuthor);
  //         newBook = await new Book({ ...args, author: savedAuthor });
  //       } else {
  //         newBook = await new Book({ ...args, author: author });
  //       }
  //
  //       await newBook.save();
  //       await pubsub.publish("BOOK_ADDED", { bookAdded: newBook });
  //       return newBook;
  //
  //
  //     } catch (error) {
  //       throw new GraphQLError("Saving book failed", {
  //         extensions: {
  //           code: "BAD_USER_INPUT",
  //           invalidArgs: args.name,
  //           error
  //         }
  //       });
  //     }
  //   }
  //   ,
  //   editAuthor: async (root, args, context) => {
  //
  //     if (!context.currentUser) {
  //       throw new GraphQLError("User must be logged in to edit author info");
  //     }
  //     // console.log(args);
  //     if (args.setBornTo < 0 || args.setBornTo > 2030) {
  //       throw new GraphQLError("setBornTo must be less than the current year", {
  //         extensions: {
  //           code: "BAD_USER_INPUT",
  //           invalidArgs: args.setBornTo
  //         }
  //       });
  //     }
  //     try {
  //       const author = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true });
  //       return author;
  //     } catch (error) {
  //       throw new GraphQLError("Updating author failed", {
  //         extensions: {
  //           code: "BAD_USER_INPUT",
  //           invalidArgs: args.setBornTo,
  //           error
  //         }
  //       });
  //     }
  //   },
  //   createUser: async (root, args) => {
  //     const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });
  //
  //     return user.save()
  //       .catch(error => {
  //         throw new GraphQLError("Creating the user failed", {
  //           extensions: {
  //             code: "BAD_USER_INPUT",
  //             invalidArgs: args.name,
  //             error
  //           }
  //         });
  //       });
  //   },
  //   login: async (root, args) => {
  //     const user = await User.findOne({ username: args.username });
  //
  //     if (!user || args.password !== "secret") {
  //       throw new GraphQLError("wrong credentials", {
  //         extensions: {
  //           code: "BAD_USER_INPUT"
  //         }
  //       });
  //     }
  //
  //     const userForToken = {
  //       username: user.username,
  //       id: user._id,
  //     };
  //
  //     return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
  //   }
  // },
  // Subscription: {
  //   bookAdded: {
  //     subscribe: async () => await pubsub.asyncIterator("BOOK_ADDED"),
  //   },
  // }
};

export default resolvers;