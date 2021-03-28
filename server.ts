/// <reference path='./models.d.ts' />

import { Application } from "https://deno.land/x/oak@v6.2.0/mod.ts";
import { GraphQLService } from "./services.ts"
import { Middleware } from "./middleware.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts";

const app = new Application();
const _config = config();
const environment = _config.ENV; // For more integrate
const port = _config.PORT || 8088;

app.use(Middleware);
app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log(`Server start at http://localhost:${port} at ${environment}`);
await app.listen({ port: Number(port) });