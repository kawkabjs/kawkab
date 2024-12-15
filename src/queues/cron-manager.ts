import cron from 'node-cron';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';
import { req } from '..';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const access = promisify(fs.access);

export class CronManager {
    private jobs: Map<string, cron.ScheduledTask>;
    private jobStatus: Map<string, boolean>;
    private fileCache: { [key: string]: string[] } = {};

    constructor() {
        this.jobs = new Map();
        this.jobStatus = new Map();
    }

    /**
     * Add a new job with a simplified schedule using a friendly interface
     * @param {string} name - The name of the job
     * @param {object} schedule - An object specifying the schedule (minute, hour, day, month, dayOfWeek)
     * @param {() => void} task - The function to execute
     * @param {boolean} [startImmediately=true] - Whether to start the job immediately
     */
    add(name: string, schedule: { minute?: number, hour?: number, day?: number, month?: number, dayOfWeek?: number }, task: () => void, startImmediately: boolean = true): void {
        if (this.jobs.has(name)) {
            throw new Error(`Job with name "${name}" already exists.`);
        }

        // Generate cron expression with defaults
        const cronExpression = [
            schedule.minute ?? '*',
            schedule.hour ?? '*',
            schedule.day ?? '*',
            schedule.month ?? '*',
            schedule.dayOfWeek ?? '*'
        ].join(' ');

        const job = cron.schedule(cronExpression, async () => {
            // Execute the main task
            task();

            // Load and execute job-specific files after task execution
            await this.loadAndExecuteCronJobFiles(name);
        }, {
            scheduled: startImmediately,
        });

        this.jobs.set(name, job);
        this.jobStatus.set(name, startImmediately);
        console.log(`Job "${name}" has been added with schedule "${cronExpression}".`);
    }

    /**
     * Remove and delete a job
     * @param {string} name - The name of the job
     */
    remove(name: string): void {
        if (!this.jobs.has(name)) {
            throw new Error(`Job with name "${name}" does not exist.`);
        }

        this.jobs.get(name)?.stop();
        this.jobs.delete(name);
        this.jobStatus.delete(name);
        console.log(`Job "${name}" has been removed.`);
    }

    /**
     * Start a job
     * @param {string} name - The name of the job
     */
    start(name: string): void {
        if (!this.jobs.has(name)) {
            throw new Error(`Job with name "${name}" does not exist.`);
        }

        this.jobs.get(name)?.start();
        this.jobStatus.set(name, true);
        console.log(`Job "${name}" has been started.`);
    }

    /**
     * Stop a job
     * @param {string} name - The name of the job
     */
    stop(name: string): void {
        if (!this.jobs.has(name)) {
            throw new Error(`Job with name "${name}" does not exist.`);
        }

        this.jobs.get(name)?.stop();
        this.jobStatus.set(name, false);
        console.log(`Job "${name}" has been stopped.`);
    }

    /**
     * List all jobs
     * @returns {string[]} The names of all scheduled jobs
     */
    list(): string[] {
        return Array.from(this.jobs.keys());
    }

    /**
     * Check if a job is running
     * @param {string} name - The name of the job
     * @returns {boolean} Whether the job is currently running
     */
    isRunning(name: string): boolean {
        if (!this.jobs.has(name)) {
            throw new Error(`Job with name "${name}" does not exist.`);
        }

        return this.jobStatus.get(name) ?? false;
    }

    /**
     * Load and execute job-specific files from a given directory
     * @param {string} directoryPath - The path to the directory
     */
    public async load(directoryPath: string): Promise<void> {
        try {
            await access(directoryPath, fs.constants.R_OK);
            const files = await this.getAllFiles(directoryPath);
            const jsTsFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.js'));
            for (const file of jsTsFiles) {
                await this.loadFile(file);
            }
        } catch (error: any) {}
    }

    /**
     * Recursively get all files in a directory and its subdirectories
     * @param {string} directoryPath - The path to the directory
     * @returns {Promise<string[]>} A list of all file paths
     */
    private async getAllFiles(directoryPath: string): Promise<string[]> {
        const files = await readdir(directoryPath);
        const filePaths: string[] = [];

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const stats = await stat(filePath);
            if (stats.isDirectory()) {
                filePaths.push(...await this.getAllFiles(filePath));
            } else {
                filePaths.push(filePath);
            }
        }

        return filePaths;
    }

    /**
     * Load a single file and instantiate its default export
     * @param {string} filePath - The path to the file
     */
    private async loadFile(filePath: string): Promise<void> {
        try {
            const fileModule = await require(filePath);
            if (fileModule.default) {
                new fileModule.default();
            } else {}
        } catch (error) {}
    }

    /**
     * Load and execute job-specific files
     * @param {string} jobName - The name of the job
     */
    private async loadAndExecuteCronJobFiles(jobName: string): Promise<void> {
        const jobDir = path.join(__dirname, 'jobs', jobName);
        if (this.fileCache[jobName]) {
            for (const file of this.fileCache[jobName]) {
                await this.loadFile(path.join(jobDir, file));
            }
        } else {
            try {
                const files = await readdir(jobDir);
                const jsTsFiles = files.filter(file => file.endsWith('.ts') || file.endsWith('.js'));
                this.fileCache[jobName] = jsTsFiles;
                for (const file of jsTsFiles) {
                    await this.loadFile(path.join(jobDir, file));
                }
            } catch (error) {}
        }
    }
}
