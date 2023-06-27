import http, { IncomingMessage, ServerResponse } from "node:http"
import { file } from "./file.js"

type Server = {
  init: () => void
  // httpServer: typeof http.createServer;
  httpServer: any
}

const server = {} as Server

server.httpServer = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const socket = req.socket as any;
    const encryption = socket.encryption as any;
    const ssl = encryption !== undefined ? "s" : "";

    const baseURL = `http${ssl}://${req.headers.host}`;
    const parsedURL = new URL(req.url ?? "", baseURL);
    const httpMethod = req.method ? req.method.toLowerCase() : "get";
    const trimmedPath = parsedURL.pathname
      .replace(/^\/+|\/+$/g, "")
      .replace(/\/\/+/g, "/")

    // const isTextFile = false // galune: .css, .js, .svg, ...
    // const isBinaryFile = false // galune: .png, .jpg, .webp, .eot, .ttf, ...
    // const isAPI = false // url prasideda: /api/.....
    // const isPage = !isTextFile && !isBinaryFile && !isAPI

    const textFileExtensions = ["css", "js", "svg", "webmanifest"]
    const binaryFileExtensions = [
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

    // type Mimes = { [key: string]: string };
    type Mimes = Record<string, string>

    const MIMES: Mimes = {
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

    let responseContent = "ERROR: neturiu tai ko tu nori..."

    if (isTextFile) {
      responseContent = "TEKSTINIS FAILAS"
    }

    if (isBinaryFile) {
      responseContent = "BINARY FAILAS"
    }

    if (isAPI) {
      const content = `{
            "id": 1,
            "name": "Jonas",
            "email": "jonas@jonas.lt"
        }`
      const [err, msg] = await file.create(
        "../data",
        "jonas@jonas.lt.json",
        content
      )
      if (err) {
        responseContent = msg
      } else {
        responseContent = content
      }
    }

    if (isAPI) {
      const content = `{
            "id": 2,
            "name": "Maryte",
            "email": "maryte@maryte.lt"
        }`
      const [err, msg] = await file.create(
        "../data",
        "maryte@maryte.lt.json",
        content
      )
      if (err) {
        responseContent = msg
      } else {
        responseContent = content
      }
    }

    if (isAPI) {
      const content = `{
            "id": 3,
            "name": "Petras",
            "email": "petras@petras.lt"
        }`
      const [err, msg] = await file.create(
        "../data",
        "petras@petras.lt.json",
        content
      )
      if (err) {
        responseContent = msg
      } else {
        responseContent = content
      }
    }

    if (isAPI) {
      const content = `{
            "id": 2,
            "name": "Maryte",
            "email": "maryte@maryte.lt"
        }`
      const [err, msg] = await file.delete("../data", "maryte@maryte.lt.json")
      if (err) {
        responseContent = msg
      } else {
        responseContent = content
      }
    }

    if (isAPI) {
      const content = `{
            "id": 1,
            "name": "Jonas",
            "email": "jonas@jonas.lt",
            "password": 1234
        }`

      const [err, msg] = await file.update(
        "../data",
        "jonas@jonas.lt.json",
        content
      )
      if (err) {
        responseContent = msg
      } else {
        responseContent = content
      }
    }

    if (isAPI) {
      const content = `{
            "id": 3,
            "name": "Petras",
            "email": "petras@petras.lt",
            "password": 0000
        }`
      const [err, msg] = await file.update(
        "../data",
        "petras@petras.lt.json",
        content
      )
      if (err) {
        responseContent = msg
      } else {
        responseContent = content
      }
    }

    if (isPage) {
      responseContent = `PUSLAPIS`
    }

    return res.end(responseContent)
  }
)

server.init = () => {
  server.httpServer.listen(4423, () => {
    console.log("Serveris sukasi ant http://localhost:4423")
  })
}

export { server }
