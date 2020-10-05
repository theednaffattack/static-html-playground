import express from "express";

export const router = express.Router();

// Home page route.
router.get("/", function (req, res) {
  res.render("index.html");
});

// Text animation route.
router.get("/text-animation", function (req, res) {
  res.send("About this text animation");
});
