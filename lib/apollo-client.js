import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://darkgreen-sardine-406947.hostingersite.com/graphql",
  cache: new InMemoryCache(),
});

export default client;