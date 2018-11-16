import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { graphql } from "graphql";
import { ApolloClient } from "apollo-client";
import { from } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-memory";
import GoalsSchema from "../api/goals/Goal.graphql";

// import { defaultState } from '../ui/config/apollo/defaultState'
const defaultState = {};

// import { defaultState } from '../ui/config/apollo/stateMutations'
const stateMutations = {};

const stateLink = withClientState({
  cache: new InMemoryCache(),
  resolvers: stateMutations,
  defaults: defaultState
});

// client.onResetStore(stateLink.writeDefaults)

const link = from({ stateLink });

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const typeDefs = [GoalsSchema];

const schema = makeExecutableSchema({ typeDefs });

const revisedRandId = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(2, 10);

// mock order
const order = {};
// mock user
const user = {};

const product = {};

const allProducts = [product];

const mocks = {
  ID: () => revisedRandId(),
  Product: () => ({
    ...product
  }),
  Order: () => ({
    ...order
  }),
  User: () => ({
    ...user
  })
};

addMockFunctionsToSchema({ schema, mocks });

const mockMang = async (query, args = {}) => {
  try {
    const res = await graphql(schema, query.loc.source.body, null, null, args);
    res.data.loading = false;
    return res.data;
  } catch (err) {
    return console.log(err.message);
  }
};

export { client };

export const mockFunc = () => null;

export const mockAsyncFunc = async () => true;

export default mockMang;
