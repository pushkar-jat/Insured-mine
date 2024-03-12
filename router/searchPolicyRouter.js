const express = require('express');
const router = express.Router();

const logger = require("winston");

// Assuming `Policy` and `User` are your Mongoose models imported from your models file
const { User, Policy } = require('../Model/model'); // Adjust the path as needed

// Search API endpoint to find policy info by username (email or first_name in this case)
router.get('/search/policies', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        // Find the user by email or first name
        const user = await User.findOne({ $or: [{ email: username }, { first_name: username }] });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find policies associated with the user's ID
        const policies = await Policy.find({ user_id: user._id }).populate('carrier_id').populate('category_id');
        // Populate to include related carrier and category details, if necessary

        res.json(policies);
    } catch (error) {
        logger.error(error);
        res.status(500).send('An error occurred while searching for policies');
    }
});

module.exports = router;
