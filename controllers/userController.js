const { User, Thought } = require("../models");

module.exports = {
    // Getting all users
    getUser(req, res) {
        User.find({})
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    
    // Getting a single User
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate("thoughts")
            .populate("friends")
            .select("-__v")
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "There as no User with that ID!" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Creating a user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // Updating a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "There as no User with that ID!" })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    //Delete a user along with their thoughts
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: "There as no User with that ID!" })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: "The user and the thought was deleted!" }))
            .catch((err) => res.status(500).json(err));
    },

