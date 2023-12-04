import schedulePingConcertsEndpoint from './schedulePingConcerts';

/**
 * Trigger the scheduling of any cron jobs
 */
function main() {
  schedulePingConcertsEndpoint();
}

export default main;
