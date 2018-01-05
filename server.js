const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();
const schema = require("./schema");

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema
  })
);

app.listen(3000, () => console.log("Listening on 3000"));
