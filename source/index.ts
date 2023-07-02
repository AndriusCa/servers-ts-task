// susiimportina
import { server } from "./libr/server.js"

// turi savo programos pasileidima // kaip inicijuoti app`a
// iskviecia funkcija
export const init = () => {
  server.init()
}

// app - rinkinys funkciju
// reikia priregistruoti nauja funkcija prie objekto
export const app = {
  init,
}

export default app

// ir tiesiog pasileidzia
app.init()
