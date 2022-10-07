import app from "./app/app.ts";
import { ink } from "deps";

const port = parseInt(Deno.env.get("PORT") || "3000");
const hostname = Deno.env.get("HOSTNAME") || "localhost";

const listener = Deno.listen({ hostname, port });
console.log(
  ink.colorize(
    `🚀 Server is running on <u><b>http://${hostname}:${port}</b></u>`,
  ),
);

const serveHttp = async (conn: Deno.Conn) => {
  const requests = Deno.serveHttp(conn);
  for await (const { request, respondWith } of requests) {
    const response = await app.handle(request, conn);
    if (response) respondWith(response);
  }
};

for await (const conn of listener) {
  serveHttp(conn);
}
