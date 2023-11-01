import { log } from './worker.js';

const isValidTime = (time: string) => {
  const [hour, minute] = time.split(':').map((num) => parseInt(num, 10));

  if (hour === null || hour === undefined || minute === null || minute === undefined) {
    return false;
  }

  return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
};

class JobDailyScheduler {
  private task: () => void;
  private time: string;
  private intervalId?: NodeJS.Timeout;
  private isRunning: boolean = false;

  constructor(task: () => void, time: string) {
    this.task = task;
    this.time = time;
  }

  start() {
    this.intervalId = setInterval(() => {
      const now = new Date();

      if (!isValidTime(this.time)) {
        log.error('Invalid time ...' + this.time);
        return;
      }

      const [hour, minute] = this.time.split(':').map((num) => parseInt(num, 10));

      if (now.getHours() === hour && now.getMinutes() === minute) {
        if (this.isRunning) {
          log.error('Previous task is still running. Skipping this cycle.');
          return;
        }

        this.isRunning = true;

        log.info('Starting scheduled task...');

        try {
          this.task();
          log.info('Finished scheduled task.');
        } catch (error) {
          log.error('Error executing task:', error);
        } finally {
          this.isRunning = false;
        }
      }
    }, 60000); // Check every minute

    log.info(`Scheduled daily task to run at ${this.time}`);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      log.info('Stopped daily task.');
    }
  }
}

export default JobDailyScheduler;
