import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";

import { addDocumentResponseHeaders } from "./shopify.server";

import http from "http";
import { Server as SocketIOServer } from "socket.io";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  _loadContext
) {
  addDocumentResponseHeaders(request, responseHeaders);

  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={ABORT_DELAY}
      />,
      {
        [callbackName]: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}



const server = http.createServer();
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  }
});

export let socketConnected
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socketConnected = socket

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start the HTTP server on the desired port (e.g., 3000)
server.listen(3000, () => {
  console.log("Socket.IO server listening on port 3000");
});