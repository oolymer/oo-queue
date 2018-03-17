import { queue, Queue } from "d3-queue"
import TinyQueue from "tinyqueue"

export { queue, TinyQueue }

export function worker() {
  const t = new TinyQueue()
  const q = queue()
  return [t, q]
}

export class Worker {

  tasks: TinyQueue
  queue: Queue

  constructor() {
    this.tasks = new TinyQueue()
    this.queue = queue()

    this.tasks.push("foo")
    this.tasks.push("bar")
    this.tasks.push("baz")
    this.tasks.push("quux")

    for (const task of this.tasks.data) {
      this.queue.defer(done => {
        console.log(task)
        done(null)
      })
    }

    // this.queue.abort()
    this.queue.awaitAll(error => {
      console.log(error)
    })
  }

}
