const router = require('express').Router();

const {
    getThought,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction
} = require('../../controllers/thoughtController');

// Get and Post thoughts 
router.route('/').get(getThought).post(createThought);

// GET a single thought, PUT and DELETE by ID
router.route('/:thoughtId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);

//  POST a reaction
router.route('/:thoughtId/reactions')
    .post(createReaction);

//  DELETE reaction by an ID
router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);


module.exports = router;

