import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import fastq from 'fastq';

type JobHandler = (data: any) => Promise<void>;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class JobQueue {
  private static queue: Queue | any; // For fastq, we don't need a Queue class
  private static worker: Worker | any; // For fastq, we use a worker function
  private static jobHandlers: Map<string, JobHandler> = new Map();
  private static useRedis: boolean;
  private static isInitialized: boolean = false;

  public static async initialize(queueName: string, redisUrl: string, useRedis: boolean = true) {
    this.useRedis = useRedis;

    if (this.useRedis) {
      try {
        const redisClient = new IORedis(redisUrl, {
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          reconnectOnError: (err) => {
            console.error('[JobQueue] Redis reconnection error:', err.message);
            return true;
          }
        });

        redisClient.on('error', (error) => {
          console.error('[JobQueue] Redis Client Error:', error.message);
        });

        redisClient.on('connect', () => {
          this.isInitialized = true;
        });

        redisClient.on('ready', () => {
          console.log('[JobQueue] Redis Client Ready');
        });

        redisClient.ping().catch((error) => {
          console.error('[JobQueue] Redis PING failed:', error.message);
        });

        this.queue = new Queue(queueName, {
          connection: redisClient,
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false
          }
        });

        this.worker = new Worker(queueName, async (job: Job) => {
          try {
            await this.handleJob(job);
          } catch (error) {
            console.error(`[JobQueue] Error processing job ${job.id}:`, error);
            throw error;
          }
        }, {
          connection: redisClient,
          concurrency: 1,
          autorun: true,
          lockDuration: 30000,
        });

        this.worker.on('completed', (job: Job) => {
          console.log(`[JobQueue] Worker completed job successfully: ${job.id}`);
        });

        this.worker.on('failed', (job: Job, error: Error) => {
          console.error(`[JobQueue] Worker job failed: ${job.id}`, error);
        });
      } catch (error) {
        console.error('[JobQueue] Failed to initialize Redis queue:', error);
        throw error;
      }
    } else {
      this.queue = fastq.promise(this.handleJob.bind(this), 1);
      this.worker = async (job: any) => {
        await this.handleJob(job);
      };
      this.isInitialized = true;
    }
  }

  public static isReady(): boolean {
    return this.isInitialized;
  }

  public static registerHandler(jobName: string, handler: JobHandler) {
    this.jobHandlers.set(jobName, handler);
  }

  public static async addJob(jobName: string, data: any, options: any = {}) {
    try {
      if (this.useRedis) {
        await this.queue.add(jobName, data, options);
      } else {
        this.queue.push({ name: jobName, data, delay: options.delay });
      }
    } catch (error) {
      console.error('[JobQueue] Error adding job:', error);
      throw error;
    }
  }

  private static async handleJob(job: Job | any) {
    try {
      if (job.delay) {
        await delay(job.delay);
      }

      const handler = this.jobHandlers.get(job.name);

      if (handler) {
        await handler(job.data);
      } else {
        console.error(`[JobQueue] No handler for job: ${job.name}`);
        throw new Error(`[JobQueue] No handler registered for job: ${job.name}`);
      }
    } catch (error) {
      console.error('[JobQueue] Error handling job:', error);
      throw error;
    }
  }

  public static async stopWorker() {
    if (this.useRedis) {
      await this.worker.close();
    }
  }

  public static async stopQueue() {
    if (this.useRedis) {
      await this.queue.close();
    }
  }
}
