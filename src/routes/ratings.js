// routes/ratings.js
import express from "express";
import fs from "fs";
import date from "date-and-time";
import { writeTable, scanTable } from "./../api/Dynamo";

const MOVIE_RATINGS_TABLE = "MovieRatings";
const ALBUM_RATINGS_TABLE = "AlbumRatings";
const RATINGS_CREDENTIALS = JSON.parse(
  fs.readFileSync(
    __dirname + "/../../credentials/ryankrolRatingsCredentials.json"
  )
);

const router = express.Router();

// rating creation middleware
router.post("/*", async (req, res, next) => {
  if (req.body.password !== RATINGS_CREDENTIALS.password) {
    res.send({ message: "Incorrect Password" });
  } else {
    // remove a password from potentially being stored
    delete req.body.password;

    // add the current date to the storage payload
    req.body.date = date.format(new Date(), "DD-MM-YYYY");

    // handover to the specific handler
    next();
  }
});

// specific routes

// create a new movie rating
router.post("/movie", async (req, res, next) => {
  const callback = () => {
    res.send({ message: "Movie Write Complete!" });
  };
  writeTable(MOVIE_RATINGS_TABLE, req.body, callback);
});

// fetch all movie ratings
router.get("/movie", async (req, res, next) => {
  const callback = data => {
    res.send(data);
  };

  try {
    await scanTable(MOVIE_RATINGS_TABLE, callback);
  } catch (e) {
    next(e);
  }
});

// create a new album rating
router.post("/album", async (req, res, next) => {
  const callback = () => {
    res.send({ message: "Album Write Complete!" });
  };
  writeTable(ALBUM_RATINGS_TABLE, req.body, callback);
});

// fetch all album ratings
router.get("/album", async (req, res, next) => {
  const callback = data => {
    res.send(data);
  };

  try {
    await scanTable(ALBUM_RATINGS_TABLE, callback);
  } catch (e) {
    next(e);
  }
});

export default router;
