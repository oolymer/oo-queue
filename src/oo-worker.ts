/// <reference path="__definitions__/tinyqueue.d.ts" />

import TinyQueue from "tinyqueue"
import PQueue from "p-queue"

export class Worker implements TaskQueue, BatchProcessor {
  _name: string
  _options: WorkerOptions<Task>

  _tasks?: TinyQueue<Task>
  _processor?: PQueue

  constructor(name: string = "default", options: WorkerOptions<Task> = {}) {
    this._name = name
    this._options = options

    this._initTaskPriorityQueue()
    this._initTaskBatchProcessor()
  }

  private _initTaskPriorityQueue() {
    this._tasks = new TinyQueue()
    this._tasks.compare = this._options.comparator || (() => 0)
  }

  private _initTaskBatchProcessor() {
    this._processor = new PQueue({
      concurrency: this._options.concurrency || 1,
      autoStart: false
    })
  }

  queueTask(task: Task) { this._tasks!.push(task) }
  dequeueTask(): Task { return this._tasks!.pop() }
  peekTask(): Task { return this._tasks!.peek() }
  clearTasks() { this._tasks!.data = [] }
  get numOfTasks(): number { return this._tasks!.length }

  queueTasks(...tasks: Task[]) {
    for (const task of tasks) {
      this.queueTask(task)
    }
  }

  dequeueTasks(numOfTasks: number = 1): Task[] {
    const batchTasks = []
    while (numOfTasks > 0 && this.numOfTasks > 0) {
      batchTasks.push(this.dequeueTask())
      numOfTasks -= 1
    }
    return batchTasks
  }

  processTasks(...tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      this._processor!.add(() => {
        return Promise.resolve()
      })
    }

    this._processor!.start()
    // this._processor.pause()

    return this._processor!.onIdle()
    // return this._processor!.onEmpty()
  }

  get numOfTasksWaiting(): number {
    return this._processor!.size
  }

  get numOfTasksRunning(): number {
    return this._processor!.pending
  }

  _log(...args: any[]) {
    console.log(`[${this.constructor.name}]`, ...args)
  }
}

interface WorkerOptions<T> {
  comparator?: (item: T, otherItem: T) => number

  batcher?: (worker: Worker) => T[]

  executor?: () => void,

  concurrency?: number
}

export interface Task {
  id: any,
  priority?: number,
  action?: TaskAction
}

type TaskAction = (done: TaskActionDone) => void
type TaskActionDone = (error?: any) => void

export interface TaskQueue {
  queueTask(task: Task): void
  dequeueTask(): Task
  peekTask(): Task
  clearTasks(): void
  numOfTasks: number
}

export interface BatchProcessor {
  queueTasks(...tasks: Task[]): void
  dequeueTasks(numOfTasks: number): Task[]
  processTasks(...tasks: Task[]): Promise<void>
  numOfTasksWaiting: number
  numOfTasksRunning: number
}
