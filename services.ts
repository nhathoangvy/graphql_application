import { Router } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { graphql, gql } from "https://deno.land/x/oak_graphql/deps.ts";
import { makeExecutableSchema } from "https://deno.land/x/oak_graphql/graphql-tools/schema/makeExecutableSchema.ts";
import { resolvers } from "./resolvers.ts"

interface Constructable<T> {
  new(...args: any): T & OakRouter;
}

interface OakRouter {
  post: any;
  get: any;
}

export interface ApplyGraphQLOptions<T> {
  Router: Constructable<T>;
  path?: string;
  typeDefs: any;
  resolvers: ResolversProps;
  context?: (ctx: any) => any;
}

export interface ResolversProps {
  Query?: any;
  Mutation?: any;
  [dynamicProperty: string]: any;
}

async function applyGraphQL<T>({
  Router,
  path = "/graphql",
  typeDefs,
  resolvers,
  context
}: ApplyGraphQLOptions<T>): Promise<T> {
  const router = new Router();

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  await router.post(path, async (ctx: any) => {
    const { response, request } = ctx;
    if (request.hasBody) {
      try {
        const contextResult = context ? await context(ctx) : undefined;
        const body = await request.body().value;
        const result = await (graphql as any)(
          schema,
          body.query,
          resolvers,
          contextResult,
          body.variables || undefined,
          body.operationName || undefined,
        );

        response.status = 200;
        response.body = result;
        return;
      } catch (error) {
        response.status = 200;
        response.body = {
          data: null,
          errors: [{
            message: error.message ? error.message : error,
          }],
        }
        return;
      }
    }
  });

  return router;
};

const decoder = new TextDecoder('utf-8');

const grapql_data = decoder.decode(await Deno.readFile('./schema.graphql'));

export const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: gql(grapql_data),
  resolvers: resolvers,
  context: (ctx: any):Promise<any> => ctx
})