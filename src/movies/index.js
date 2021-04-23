import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const router = express.Router()

const thisFilePath = fileURLToPath(import.meta.url)
const __dirname = dirname(thisFilePath)

const getMovies = () => {
  const buf = fs.readFileSync(join(__dirname, "media.json"))
  return JSON.parse(buf.toString())
}

router.get("/", (req, res) => {
  
  try {
    const movies = getMovies()
    console.log("QUERY: ", req.query.title)
    if (req.query && req.query.name) {
      const filteredMovies = movies.filter(movie => movie.hasOwnProperty("title") && movie.title === req.query.title)
      res.send(filteredMovies)
    } else {
      res.send(movies)
    }
  } catch (error) {
    console.log(error)
  }
})


router.post("/", (req, res) => {
  try {
    const movies = getMovies()
    const newMovie = { ...req.body, ID: uniqid(), createdAt: new Date() }

    movies.push(newMovie)

    fs.writeFileSync(join(__dirname, "media.json"), JSON.stringify(movies))

    res.status(201).send({ id: newMovie.ID })
  } catch (error) {
    console.log(error)
  }
})

router.put("/:id", (req, res) => {
  try {
    const movies = getMovies()

    const newMovies = students.filter(student => student.ID !== req.params.id)

    const modifiedMovie = { ...req.body, ID: req.params.id, modifiedAt: new Date() }

    newMovies.push(modifiedMovie)
    fs.writeFileSync(join(__dirname, "movies.json"), JSON.stringify(newMovies))

    res.send(modifiedStudent)
  } catch (error) {
    console.log(error)
  }
})

router.delete("/:id", (req, res) => {
  try {
    const students = getMovies()

    const newStudents = students.filter(student => student.ID !== req.params.id)
    fs.writeFileSync(join(__dirname, "movies.json"), JSON.stringify(newStudents))
    res.status(204).send()
  } catch (error) {
    console.log(error)
  }
})

export default router