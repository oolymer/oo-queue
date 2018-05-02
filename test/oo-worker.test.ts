import { Worker, Task } from "../src/oo-worker"
import { Spies } from "./test-helpers"

describe("oo-worker", () => {

  describe("task queue", () => {
    let worker: Worker
    const task1: Task = { id: 1 }
    const task2: Task = { id: 2 }

    beforeEach(() => {
      // given:
      worker = new Worker()
    })

    it("should queue task", () => {
      // expect:
      worker.queueTask(task1)
      worker.queueTask(task2)
    })

    it("should dequeue task", () => {
      // when:
      worker.queueTask(task1)
      worker.queueTask(task2)

      // then:
      expect(worker.dequeueTask()).toBe(task1)
    })

    it("should dequeue tasks", () => {
      // when:
      worker.queueTask(task1)
      worker.queueTask(task2)

      // then:
      expect(worker.dequeueTask()).toBe(task1)
      expect(worker.dequeueTask()).toBe(task2)
    })

    it("should peek task", () => {
      // when:
      worker.queueTask(task1)
      worker.queueTask(task2)

      // then:
      expect(worker.peekTask()).toBe(task1)
      expect(worker.peekTask()).toBe(task1)
    })

    it("should number of tasks", () => {
      // when:
      worker.queueTask(task1)
      worker.queueTask(task2)

      // then:
      expect(worker.numOfTasks).toBe(2)
    })
  })

  describe("task priority queue", () => {
    let worker: Worker
    const foo1: Task = { id: "foo-1", priority: 2 }
    const foo2: Task = { id: "foo-2", priority: 2 }
    const foo3: Task = { id: "foo-3", priority: 2 }
    const bar1: Task = { id: "bar-1", priority: 1 }
    const bar2: Task = { id: "bar-2", priority: 3 }
    const bar3: Task = { id: "bar-3", priority: 3 }

    beforeEach(() => {
      // given:
      const accendingComparator = (task: Task, otherTask: Task) =>
        task.priority! - otherTask.priority!
      worker = new Worker(undefined, {
        comparator: accendingComparator
      })
    })

    it("should dequeue tasks in order", () => {
      // when:
      worker.queueTasks(foo1, foo2, foo3)

      // then:
      expect(worker.dequeueTasks(10)).toEqual([
        foo1, foo3, foo2
      ])
    })

    it("should dequeue tasks in order", () => {
      // when:
      worker.queueTasks(foo1, foo2, foo3, bar1, bar2, bar3)

      // then:
      expect(worker.dequeueTasks(10)).toEqual([
        bar1, foo1, foo2, foo3, bar3, bar2
      ])
    })
  })

  describe("complex worker", () => {
    // const consoleLogSpy = Spies.consoleLog()

    // afterEach(() => {
    //   expect(consoleLogSpy.mock.calls).toMatchSnapshot()
    // })

    it("should contain tasks", done => {
      // given:
      const worker = new Worker(undefined, {
        concurrency: 5
      })

      // when:
      for (let index = 0; index < 25; index += 1) {
        worker.queueTasks({
          id: index,
          priority: index,
          action: done => setTimeout(done, 1000)
        })
      }

      // then:
      expect(worker.numOfTasks).toEqual(25)
      expect(worker._tasks!.data).toMatchSnapshot()

      // when:
      const batch = worker.dequeueTasks(10)

      // then:
      expect(worker.numOfTasks).toEqual(15)
      expect(worker._processor!.size).toEqual(0)
      expect(worker._processor!.pending).toEqual(0)

      // when:
      const batchPromise = worker.processTasks(...batch)

      // then:
      expect(worker.numOfTasks).toEqual(15)
      expect(worker._processor!.size).toEqual(5)
      expect(worker._processor!.pending).toEqual(5)
      batchPromise.then(done)
    })

    it("should call task actions", done => {
      const worker = new Worker()

      const t1: Task = { id: 1, priority: 1, action: buildAction() }
      const t2: Task = { id: 2, priority: 2, action: buildAction() }
      const t3: Task = { id: 3, priority: 3, action: buildAction() }

      worker.queueTasks(t1, t2, t3)
      expect(worker.numOfTasks).toEqual(3)

      worker.processTasks(...worker.dequeueTasks(2)).then(() => {
        expect(worker.numOfTasks).toEqual(1)
        done()
      })
    })

    function buildAction(delayMillis = 100): any {
      return (done: () => {}) => {
        console.log("action!")
        setTimeout(done, delayMillis)
      }
    }
  })
})
