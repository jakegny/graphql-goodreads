const fetch = require("node-fetch");
const util = require("util");
const Promise = require("bluebird");
const parseXML = Promise.promisify(require("xml2js").parseString);
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require("graphql");

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "...",
  fields: () => ({
    name: {
      type: GraphQLString,
      resolve: xml => {
        console.log(xml.GoodreadsResponse.author[0]);

        return xml.GoodreadsResponse.author[0].name[0];
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: xml => xml.GoodreadsResponse.author[0].books[0].book
    }
  })
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "...",
  fields: () => ({
    title: {
      type: GraphQLString,
      resolve: book => {
        console.log("book", book);
        return book.title[0];
      }
    },
    isbn: {
      type: GraphQLString,
      resolve: book => {
        return book.isbn[0];
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    description: "...",
    fields: () => ({
      author: {
        type: AuthorType,
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (root, args) =>
          fetch(
            `https://www.goodreads.com/author/show.xml?id=${
              args.id
            }&key=HjP3B1HahS9tRMe8P3cYw`
          )
            .then(res => res.text())
            .then(parseXML)
            .catch(err => {
              console.error(err);
            })
      }
    })
  })
});
