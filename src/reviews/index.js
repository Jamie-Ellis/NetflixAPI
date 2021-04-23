import express from "express"

import uniqid from "uniqid"
import { check, validationResult } from "express-validator"

import { getReviews, writeReviews } from "../lib/fs-tools.js"

const router = express.Router()

router.get("/", async (req, res, next) => {
  // http://localhost:3002/students --> full list of students http://localhost:3002/students?name=Bruce&ID=123412312 --> filtered list of students
  try {
    const reviews = await getReviews()

    if (req.query && req.query.name) {
      const filteredReviews = reviews.filter(review => review.hasOwnProperty("name") && review.name === req.query.name)

      res.send(filteredReviews)
    } else {
      res.send(reviews)
    }
  } catch (error) {
    console.log(error)
    next(error) // SENDING ERROR TO ERROR HANDLERS (no httpStatusCode automatically means 500)
  }
})

router.get("/:name", async (req, res, next) => {
  //http://localhost:3002/students/123412312
  try {
    const reviews = await getReviews()

    const review = reviews.find(review => review.ID === req.params.name)
    if (review) {
      res.send(review)
    } else {
      const err = new Error("User not found")
      err.httpStatusCode = 404
      next(err)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.post(
  "/",
  [check("name").exists().withMessage("Name is mandatory field!"), check("comment").exists().withMessage("Add a comment!")],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const err = new Error()
        err.errorList = errors
        err.httpStatusCode = 400
        next(err)
      } else {
        const reviews = await getReviews()
        const newReview = { ...req.body, ID: uniqid(), createdAt: new Date() }

        reviews.push(newReview)

        await writeReviews(reviews)

        res.status(201).send({ id: newStudent.ID })
      }
    } catch (error) {
      error.httpStatusCode = 500
      next(error)
    }
  }
)

router.put("/:name", async (req, res, next) => {
  try {
    const reviews = await getReviews()

    const newReviews = reviews.filter(review => review.ID !== req.params.id)

    const modifiedReview = { ...req.body, ID: req.params.id, modifiedAt: new Date() }

    newReviews.push(modifiedReview)
    await writeReviews(newReviews)

    res.send(modifiedReview)
  } catch (error) {
    console.log(error)
  }
})

router.delete("/:name", async (req, res, next) => {
  try {
    const reviews = await getReviews()

    const newReviews = reviews.filter(review => review.ID !== req.params.id)
    await writeReviews(newReviews)
    res.status(204).send()
  } catch (error) {
    console.log(error)
  }
})

export default router