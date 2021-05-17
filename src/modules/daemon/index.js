import schedule from 'node-schedule';
import { sleep } from 'noodle-utils';
import primeSite from './prime';

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
  await sleep(1000 * 60);

  runDaemons();

  schedule.scheduleJob('0 0 0 * * *', async () => {
    runDaemons();
  });
}

export default main;
