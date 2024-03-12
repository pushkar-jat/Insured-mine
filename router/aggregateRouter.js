const express = require('express');
const router = express.Router();

const logger = require("winston");

// Assuming `Policy` is your Mongoose model imported from your models file
const { Policy, User } = require('../Model/model'); // Adjust the path as needed

// API endpoint to aggregate policies by user
router.get('/aggregate/policies', async (req, res) => {
    try {
        const aggregatedPolicies = await Policy.aggregate([
            {
                $group: {
                    _id: "$user_id",
                    totalPolicies: { $sum: 1 },
                    totalPremium: { $sum: "$premium_amount" }
                }
            },
            {
                $lookup: {
                    from: User.collection.name,
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    totalPolicies: 1,
                    totalPremium: 1,
                    userName: "$userInfo.first_name",
                    userEmail: "$userInfo.email"
                }
            }
        ]);

        res.json(aggregatedPolicies);
    } catch (error) {
        logger.error(error);
        res.status(500).send('An error occurred while aggregating policies');
    }
});

module.exports = router;
