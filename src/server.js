import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"
import studentsRoutes from "./students/index.js"
import moviesRoutes from "./movies/index.js"
import problematicRoutes from "./problematicRoutes/index.js"
import filesRoutes from "./files/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandling.js"
import { getCurrentFolderPath } from "./lib/fs-tools.js"
const server = express()

const port = process.env.PORT || 3000 // loading the environment variable called PORT, contained in .env file
const publicFolderPath = join(getCurrentFolderPath(import.meta.url), "../public")
const loggerMiddleware = (req, res, next) => {
  console.log("Fourth middleware")
  console.log(`Request method: ${req.method} ${req.url} -- ${new Date()}`)
  next() // mandatory to give the control to what is happening next (next middleware in chain or route handler)
}

server.use(express.static(publicFolderPath))
server.use(cors())
server.use(express.json())
// server.use(loggerMiddleware) // application level

// server.use("/problematic", problematicRoutes)
server.use("/movies", moviesRoutes)
server.use(
  "/students",
  [
    (req, res, next) => {
      console.log("Hello I'm the third middleware")
      next()
    },
    loggerMiddleware,
  ],
  studentsRoutes
) // router level
server.use("/files", filesRoutes)

// ERROR MIDDLEWARES (AFTER ROUTES)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.log(listEndpoints(server))
server.listen(port, () => console.log("Server running on port: ", port))
© 2021 GitHub, Inc.