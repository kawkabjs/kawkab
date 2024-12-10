import { jobQueue } from '..';

export abstract class BaseJob {
  name(): string {
    return "Job";
  }

  attempts(): number {
    return 3;
  }

  delay(): number {
    return 5000;
  }

  // Change send to be processed directly in the constructor
  constructor(data: any = {}) {
    this.register();
    this.job(data);
  }

  // handle method must be implemented in the child class
  public async handle(data: any = {}) {
    throw new Error('Handle method must be implemented in the child class.');
  }

  // register the handler for the job in jobQueue
  private register() {
    jobQueue.registerHandler(this.name(), this.handle.bind(this));
  }

  // job method adds the job to the jobQueue with attempts and delay
  private async job(data: any) {
    await jobQueue.addJob(this.name(), data, {
      attempts: this.attempts(),
      delay: this.delay()
    });
  }
}
