import fetch from 'node-fetch';
import cron from 'node-cron';

/**
 * Sschedules a ping to the concerts endpoint
 */
async function schedulePingConcertsEndpoint() {
  cron.schedule('0 0 * * *', () => {
    fetch('http://ryankrol.co.uk/api/concerts');
  });
}

export default schedulePingConcertsEndpoint;
