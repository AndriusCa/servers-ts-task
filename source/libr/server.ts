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
    const socket = req.socket as any
    const encryption = socket.encryption as any
    const ssl = encryption !== undefined ? "s" : ""

    const baseURL = `http${ssl}://${req.headers.host}`
    const parsedURL = new URL(req.url ?? "", baseURL)
    const httpMethod = req.method ? req.method.toLowerCase() : "get"
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

    let responseContent = "ERROR: neturiu tai ko tu nori..."

    if (isTextFile) {
      const content = "labas"
      const fileCreateResponse = await file.create(
        "../../data",
        "hey.txt",
        content
      )
      console.log(fileCreateResponse)

      let fileReadResponse = await file.read("../../public/css", "button.css")
      console.log(fileReadResponse)
      //  console.log(JSON.parse(fileReadResponse[1]));
    }

    if (isBinaryFile) {
      responseContent = "BINARY FAILAS"
    }

    if (isAPI) {
      responseContent = "API DUOMENYS"
    }

    if (isPage) {
      responseContent = `page`
    }

    // puslapio html
    // failai:
    // - tekstiniai:
    //      - css failu
    //      - js failu
    //      - svg failu
    // - ne tekstiniai:
    //      - img failu
    //      - fonts failu
    //      - video failu
    //      - audio failu
    //      - pdf failu
    // duomenu JSON

    // if (trimmedPath === "/") {
    //   responseContent = `
    // }

    return res.end(responseContent)
  }
)

server.init = () => {
  server.httpServer.listen(4423, () => {
    console.log("Serveris sukasi ant http://localhost:4423")
  })
}

export { server }
