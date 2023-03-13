const { User, Thought } = require("../models");

module.exports = {
    // Geting all thoughts
    getThought(req, res) {
        Thought.find({})
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

    // Getting a single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select("-__v")
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "There was no thought found with this ID!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Creating a thought and pushing the thought's _id to the respective user's thoughts
    createThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "There was no thought found with this ID!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Updating a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, New: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "There was no thought found with this ID!" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Deleting a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "There was no thought found with this ID!" })
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
            )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'There was no user found with this thought, but it was deleted!' })
                    : res.json({ message: 'The thought has been deleted!' })
            )
            .catch((err) => res.status(500).json(err));
    },

    // Creating a reaction
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "There was no thought found with this ID!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    
    // Deleting a reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: "There was no thought with this ID!" })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};
