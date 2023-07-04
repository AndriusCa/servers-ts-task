import http, { IncomingMessage, ServerResponse } from "node:http"
import { file } from "./file.js"
import { StringDecoder } from "node:string_decoder"
import { json } from "stream/consumers"

export const serverLogic = async (req: IncomingMessage, res: ServerResponse) => {
  const baseUrl = `http://${req.headers.host}`
  const parsedUrl = new URL(req.url ?? "", baseUrl)
  const trimmedPath = parsedUrl.pathname
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/\/+/g, "/")

  const textFileExtensions = ["css", "js", "svg", "webmanifest"]
  const binaryFileExtensions = [
    "gif",
    "png",
    "jpg",
    "jpeg",
    "webp",
    "ico",
    "eot",
    "ttf",
    "woff",
    "woff2",
    "otf",
  ]

  const fileExtension = trimmedPath.slice(trimmedPath.lastIndexOf(".") + 1)

  const isTextFile = textFileExtensions.includes(fileExtension)
  const isBinaryFile = binaryFileExtensions.includes(fileExtension)
  const isAPI = trimmedPath.startsWith("api/")
  const isPage = !isTextFile && !isBinaryFile && !isAPI

  // const isTextFile = false // galune: .css, .js, .svg, ...
  // const isBinaryFile = false // galune: .png, .jpg, .webp, .eot, .ttf, ...
  // const isAPI = false // url prasideda: /api/.....
  // const isPage = !isTextFile && !isBinaryFile && !isAPI

  // type Mimes = { [key: string]: string };
  type Mimes = Record<string, string>

  const MIMES: Mimes = {
    gif: "image/gif",
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    json: "application/json",
    txt: "text/plain",
    svg: "image/svg+xml",
    xml: "application/xml",
    ico: "image/vnd.microsoft.icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    woff2: "font/woff2",
    woff: "font/woff",
    ttf: "font/ttf",
    webmanifest: "application/manifest+json",
  }

  let responseContent: string | Buffer = ""
  let buffer = ""
  const stringDecoder = new StringDecoder("utf-8")

  req.on("data", (data) => {
    buffer += stringDecoder.write(data)
  })

  req.on("end", async () => {
    buffer += stringDecoder.end()

    if (isTextFile) {
      const [err, msg] = await file.readPublic(trimmedPath)

      if (err) {
        res.statusCode = 404
        responseContent = `Error: could not find file: ${trimmedPath}`
      } else {
        res.writeHead(200, {
          "Content-Type": MIMES[fileExtension],
        })
        responseContent = msg
      }
    }

    if (isBinaryFile) {
      const [err, msg] = await file.readPublicBinary(trimmedPath)

      if (err) {
        res.statusCode = 404
        responseContent = `Error: could not find file: ${trimmedPath}`
      } else {
        res.writeHead(200, {
          "Content-Type": MIMES[fileExtension],
        })
        responseContent = msg
      }
    }

    if (isAPI) {
      const jsonData = buffer ? JSON.parse(buffer) : {};

    if (isAPI && req.method === "POST") {
      
      const [err, msg] = await file.create("users", jsonData.email + '.json', jsonData)
      if (err) {
        responseContent = msg.toString()
      } else {
        responseContent = "User Created"
       }
      }
      // if (isAPI && req.method === "GET" && trimmedPath.startsWith("api/user/[ID]")) {
      //   const userID = trimmedPath.split("/")[2]
      //   const [err, msg] = await file.read("users", userID)
      //   if (err) {
      //     responseContent = msg.toString()
      //   } else {
      //     responseContent = msg;
      //   }
      // }

      if (isAPI && req.method === "GET" && trimmedPath.startsWith("api/user-by-email/")) {
        const email = trimmedPath.split("/")[2]
        const [err, msg] = await file.readByEmail("users", email)
        if (err) {
          responseContent = msg.toString()
        } else {
          responseContent = msg.toString();
        }
      }

       else if (req.method === "PUT") {
        const [err, msg] = await file.update("users", jsonData.email + ".json", jsonData
        );
        if (err) {
          responseContent = msg.toString();
        } else {
          responseContent = "User updated";
        }
      }  else if (req.method === "DELETE") {
        const [err, msg] = await file.delete("users", jsonData.email + ".json");
        if (err) {
          responseContent = msg.toString();
        } else {
          responseContent = "User Deleted";
        };
      };


    

    if (isPage) {
      res.writeHead(200, {
        "Content-Type": MIMES.html,
      })
      responseContent = "CONTENT"
    };

    res.end(responseContent);
  });
}

export const httpServer = http.createServer(serverLogic);

export const init = () => {
  httpServer.listen(4423, () => {
    console.log(' Server is running on http://localhost:4423')
  })
};



export const server = {
  init,
  httpServer
};


export default server;
