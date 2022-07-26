const router = require('express').Router();
const Movie = require('../Models/Movie');
const verify = require('../VerifyToken');

//create
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovie = new Movie(req.body);

        try {
            const savedMovie = await newMovie.save();

            res.status(201).json(savedMovie);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You are not authorized!");
    }
});

//update
router.put("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {
                new: true
            });

            res.status(200).json(updatedMovie);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You are not authorized!");
    }
});

//delete
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json("Movie has been deleted!");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You are not authorized!");
    }
});

//get by id
router.get("/find/:id", verify, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get random
router.get("/random", verify, async (req, res) => {
    const type = req.query.type;

    let movie;

    try {
        if (type === "series") {
            movie = await Movie.aggregate([
                { $match: { isSeries: true } },
                { $sample: { size: 1 } },
            ]);
        } else {
            movie = await Movie.aggregate([
                { $match: { isSeries: false } },
                { $sample: { size: 1 } },
            ]);
        }
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all
router.get("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const movies = await Movie.find();

            res.status(200).json(movies.reverse());
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("You are not authorized!");
    }
});

module.exports = router;