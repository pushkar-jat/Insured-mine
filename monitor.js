const pm2 = require('pm2');
const os = require('os');

// Connect to PM2
pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  // Function to check CPU usage and restart `index.js` if necessary
  function checkAndRestart() {
    const cpus = os.cpus();
    let totalLoad = 0;

    cpus.forEach((core) => {
      let coreLoad = 0;
      for (let type in core.times) {
        coreLoad += core.times[type];
      }
      totalLoad += (coreLoad - core.times.idle) / coreLoad;
    });

    const cpuUsagePercent = (totalLoad / cpus.length) * 100;

    // Log current CPU usage
    console.log(`CPU Usage: ${cpuUsagePercent.toFixed(2)}%`);

    // Restart `index.js` if CPU usage exceeds 70%
    if (cpuUsagePercent > 70) {
      console.log('Restarting `index.js` due to high CPU usage...');
      pm2.restart('myServer', (err) => {
        if (err) console.error('Error restarting `index.js`:', err);
        else console.log('`index.js` restarted successfully.');
      });
    }
  }

  // Check every 10 seconds
  setInterval(checkAndRestart, 10000);
});
