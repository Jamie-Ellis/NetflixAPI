import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"
import reviewsRoutes from "./reviews/index.js"
import moviesRoutes from "./movies/index.js"
import filesRoutes from "./files/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandling.js"
import { getCurrentFolderPath } from "./lib/fs-tools.js"
const server = express()

const port = process.env.PORT || 3000 // loading the environment variable called PORT, contained in .env file
const publicFolderPath = join(getCurrentFolderPath(import.meta.url), "../public")
const loggerMiddleware = (req, res, next) => {
  console.log("Fourth middleware")
  console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
  next() 
}

server.use(express.static(publicFolderPath))
server.use(cors())
server.use(express.json())

server.use("/movies", moviesRoutes)
server.use(
  "/reviews",
  [
    (req, res, next) => {
      next()
    },
    loggerMiddleware,
  ],
  reviewsRoutes
) 
server.use("/files", filesRoutes)

// ERROR MIDDLEWARES (AFTER ROUTES)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.log(listEndpoints(server))
server.listen(port, () => console.log("Server running on port: ", port))
