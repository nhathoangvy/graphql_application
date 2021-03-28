FROM hayd/deno:1.5.2

EXPOSE 8088

WORKDIR /terra/app

COPY . /terra/app
RUN deno cache server.ts

ENTRYPOINT deno run --allow-net --allow-env --allow-write --allow-read --allow-plugin server.ts