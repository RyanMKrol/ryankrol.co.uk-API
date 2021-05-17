import schedule from 'node-schedule';
import primeSite from './primeSite';

/**
 * Function to run the daemons used by the site
 */
async function runDaemons() {
  primeSite();
}

/**
 * Function to start running/scheduling all daemons used by the site
 */
async function main() {
  runDaemons();

  schedule.scheduleJob('0 0 0 * * *', async () => {
    runDaemons();
  });
}

export default main;
