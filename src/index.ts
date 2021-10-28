import 'reflect-metadata';
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './resolvers/RegisterResolver';
import session from 'express-session';
import pgSession from 'express-pg-session';
import pg from 'pg';
import cors from 'cors';
import { LoginResolver } from './resolvers/Login';
import { MeResolver } from './resolvers/Me';
import { UserConfirmResolver } from './resolvers/UserConfirmResolver';

async function main(){
  let pgPool = new pg.Pool({
    host: 'localhost',
    user: 'postgres',
    password: "test",
    database: "db"
  });


  await createConnection();

  let columnNames = {
    session_id: 'sid',
    session_data: 'sess',
    expire: 'expire'
  };
  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver, UserConfirmResolver],
    emitSchemaFile: true,
    validate: true,
  });
  const pgSess = pgSession(session);
  const app = express();
  app.use(session({
    saveUninitialized: false,
    store: new pgSess({
      pool: pgPool,
      tableName: 'session',
      columns: columnNames
    }),
    secret: "THIS IS CUSTOM SECRET",
    resave: false,
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000}
  }));

  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }));

  const server = new ApolloServer({schema , context: ({ req, res }) => ({ req, res })});
  await server.start();

  server.applyMiddleware({app});

  app.listen(4000, ()=>{
    console.log("Server is listening on http://localhost:4000/graphql");
  })

}
main();