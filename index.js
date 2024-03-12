// Importing necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { Worker } = require('worker_threads');
const winston = require("winston");
const class_name = "SERVER_FILE"

const { initializeLogger } = require("./utilities/logger"); 
const logger = initializeLogger();

if (process.env.Environment !== "production") {
  // add a logger logger transport
  logger.add(
    new winston.transports.logger({
      format: winston.format.simple(),
    })
  );
}

const dotenv = require("dotenv");
// Import required bot configuration.
const ENV_FILE = process.env.NODE_ENV || "dev";
dotenv.config({ path: ".env.local" });
// Import routers and models
const searchRouter = require('./router/searchPolicyRouter');
const aggregateRouter = require('./router/aggregateRouter');
const schedulerRouter = require('./router/schedulerRouter')

// Initializing express application
const app = express();
const port = 3000;

// Configuration for file storage using multer
const upload = multer({ dest: 'uploads/' });

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// MongoDB connection setup
mongoose.connect(
    process.env.MONGODB_STRING, 
    { useNewUrlParser: true }
).then(() => logger.info('MongoDB Connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Endpoint for file upload, utilizing a worker thread for file processing
app.post('/api/upload-docs', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const worker = new Worker('./processor/fileProcessor.js', {
            workerData: {
                path: req.file.path,
                originalname: req.file.originalname
            }
        });

        worker.on('message', (message) => {
            res.send(message);
        });

        worker.on('error', (error) => {
            res.status(500).send('Error processing file: ' + error.message);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                res.status(500).send(`Worker stopped with exit code ${code}`);
            }
        });
    } catch (error) {
        res.status(500).send('Server error: ' + error.message);
        logger.error(`${class_name} - Worker thread file uploading error`,{
            "Data": workerData 
        })
    }
});

// Routes for search the policies
app.use('/api', searchRouter);

// Routes to fetch the aggregate policy of users
app.use('/api', aggregateRouter);

// Endpoint for scheduling a message
app.post('/api', schedulerRouter);

// Starting the server
app.listen(port, () => logger.info(`Server running on port ${port}`));
