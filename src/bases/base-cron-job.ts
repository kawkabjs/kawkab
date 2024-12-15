import { cron } from "..";

// Define an enum for days of the week
export enum CronJobDayOfWeekEnum {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export abstract class BaseCronJob {
  constructor() {
    if (this.isEnabled()) {
      // Generate a unique job name using date and random string
      cron.add(
        new Date().toLocaleString() + ', ' +
          Math.random().toString(36).substring(2, 12),
        {
          // Ensure that the values returned are always numbers or undefined
          minute: this.toNumberOrUndefined(this.minute()),
          hour: this.toNumberOrUndefined(this.hour()),
          day: this.toNumberOrUndefined(this.dayOfMonth()),
          month: this.toNumberOrUndefined(this.month()),
          dayOfWeek: this.toNumberOrUndefined(this.dayOfWeek()), 
        },
        this.handle
      );
    }
  }

  // Converts the value to a number or undefined if the value is not a valid number
  private toNumberOrUndefined(value: number | string): number | undefined {
    const parsed = typeof value === "string" ? parseInt(value) : value;
    return isNaN(parsed) ? undefined : parsed;
  }

  // Abstract methods to be implemented in the subclass
  abstract isEnabled(): boolean;
  abstract minute(): number | string;
  abstract hour(): number | string;
  abstract dayOfMonth(): number | string;
  abstract month(): number | string;
  abstract dayOfWeek(): number | string;
  abstract handle(): Promise<void>;
}
