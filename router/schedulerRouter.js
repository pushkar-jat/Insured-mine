const express = require('express');
const router = express.Router();

const logger = require("winston");

const schedule = require('node-schedule');

// Assuming `Policy` and `User` are your Mongoose models imported from your models file
const { Message } = require('../Model/message'); // Adjust the path as needed

// Search API endpoint to find policy info by username (email or first_name in this case)
router.post('/schedule-message', async (req, res) => {
    const { message, day, time } = req.body;

    // Validate request body
    if (!message || !day || !time) {
        return res.status(400).send('Missing message, day, or time.');
    }

    try {
        const postTime = new Date(`${day}T${time}`);

        // Schedule the message to be saved to the database
        schedule.scheduleJob(postTime, async () => {
            const newMessage = new Message({ message, postTime });
            await newMessage.save();
            logger.log('Message saved:', message);
        });

        res.send('Message scheduled successfully');
    } catch (error) {
        res.status(500).send('Error scheduling message: ' + error.message);
    }
});

module.exports = router;
