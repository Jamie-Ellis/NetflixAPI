import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const mediaPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/media") 

// console.log(studentsFolderPathLuca)
console.log(mediaPath)
export const getReviews = async () => await readJSON(join(dataFolderPath, "reviews.json"))
export const getMovies = async () => await readJSON(join(dataFolderPath, "media.json"))
export const writeReviews = async content => await writeJSON(join(dataFolderPath, "reviews.json"), content)
export const writeMovies = async content => await writeJSON(join(dataFolderPath, "media.json"), content)

export const writeMediaPictures = async (fileName, content) => await writeFile(join(mediaPath, fileName), content)

export const getCurrentFolderPath = currentFile => dirname(fileURLToPath(currentFile))

export const readMediaPictures = fileName => createReadStream(join(mediaPath, fileName))