import express from "express"
import { writeMediaPictures, readMediaPictures } from "../lib/fs-tools.js"
import multer from "multer"
import { pipeline } from "stream"
import zlib from "zlib"

const router = express.Router()

router.post("/upload", multer().single("singlePic"), async (req, res, next) => {
  try {
    console.log(req.file)
    await writeMediaPictures(req.file.originalname, req.file.buffer)
    res.send("ok")
  } catch (error) {
    console.log(error)
  }
})

router.post("/uploadMultiple", multer().array("multiplePics", 2), async (req, res, next) => {
  try {
    const arrayOfPromises = req.files.map(async file => await writeMediaPictures(file.originalname, file.buffer))

    await Promise.all(arrayOfPromises)
    res.send("ok")
  } catch (error) {
    console.log(error)
  }
})

router.get("/:fileName/download", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", `attachment;`) 

    const source = readMediaPictures(req.params.fileName) 
    const destination = res 

    pipeline(source, zlib.createGzip(), destination, err => console.log(err)) 
  } catch (error) {}
})

export default router