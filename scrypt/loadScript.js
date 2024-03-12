const axios = require('axios');
const os = require('os');

const logger = require("winston");

// URL of your API endpoint
const SEARCH_API_URL = 'http://localhost:3000/api/search/policies?username=testUser';
const AGGREGATE_API_URL = 'http://localhost:3000/api/aggregate/policies';

// Function to simulate load on a specific endpoint
async function simulateLoad(url, requestsPerSecond) {
  for (let i = 0; i < requestsPerSecond; i++) {
    axios.get(url)
      .then(response => console.log(`Response from ${url}:`, response.status))
      .catch(error => console.error(`Error calling ${url}:`, error.message));
  }
}

// Main function to increase CPU load
function increaseCPULoad() {
  const cores = os.cpus().length;
  const targetLoadPerCore = 0.9; // Target load per core (50%)
  const totalLoad = cores * targetLoadPerCore;
  
  logger.log(`Generating load to simulate ${totalLoad * 100}% CPU usage across ${cores} cores...`);
  
  // Calculate an arbitrary number of requests per second to simulate the load
  // This will vary greatly based on your server's capacity and the complexity of the API endpoints
  const requestsPerSecond = 100; // Start with a guess and adjust based on observed load

  // Simulate load on both endpoints
  setInterval(() => simulateLoad(SEARCH_API_URL, requestsPerSecond / 2), 1000);
  setInterval(() => simulateLoad(AGGREGATE_API_URL, requestsPerSecond / 2), 1000);
}

// Start increasing load
increaseCPULoad();
