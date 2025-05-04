import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './config/connection.js';
import routes from './routes/index.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import { getUserFromToken } from './services/auth.js'; // make sure path matches

const app = express();
const PORT = process.env.PORT || 3001;



const server = new ApolloServer({
  typeDefs,
  resolvers,
});


async function startApolloServer() {
  await server.start();

  app.use(cors());
  app.use(bodyParser.json());

  // Apply Apollo middleware with context function
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }: { req: express.Request }) => {
        const authHeader = req.headers.authorization || '';
        const user = getUserFromToken(authHeader);
        return { user };
      },
    })
  );

  // Static assets if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () =>
      console.log(`🌍 Server running at http://localhost:${PORT}/graphql`)
    );
  });
}

startApolloServer();
