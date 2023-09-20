import { log } from './worker.js';

type JobSchedulerOptions = {
  hour?: number;
  minute?: number;
  second?: number;
};

class JobScheduler {
  private static tasks: (() => void)[] = [];
  private static intervalId?: NodeJS.Timeout;
  private static isRunning: boolean = false;

  static register(task: () => void) {
    this.tasks.push(task);
  }

  static every(options: JobSchedulerOptions) {
    let milliseconds = 0;

    if (options.hour) {
      milliseconds += options.hour * 60 * 60 * 1000;
    }
    if (options.minute) {
      milliseconds += options.minute * 60 * 1000;
    }
    if (options.second) {
      milliseconds += options.second * 1000;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    return {
      start: () => {
        if (milliseconds <= 0) {
          throw new Error('Invalid scheduling options provided.');
        }

        this.intervalId = setInterval(() => {
          if (this.isRunning) {
            log.error('Previous task is still running. Skipping this cycle.');
            return;
          }

          this.isRunning = true;
          log.info('Starting scheduled tasks...');

          for (const task of this.tasks) {
            try {
              task();
            } catch (error) {
              log.error('Error executing task:', error);
            }
          }

          log.info('Finished scheduled tasks.');
          this.isRunning = false;
        }, milliseconds);

        log.info(`Starting scheduler, configured to run every ${milliseconds / 1000} seconds`);
      },
    };
  }
}

export default JobScheduler;
