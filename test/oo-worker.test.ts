import { Worker } from "../src/oo-worker"

describe("oo-worker", () => {
  describe("logs", () => {
    // const logSpy = jest.spyOn(console, "log")
    // logSpy.mockName("console.log")
    // logSpy.mockReturnThis()

    afterEach(() => {
      // expect(logSpy.mock.calls).toMatchSnapshot()
      // logSpy.mockClear()
    })

    afterAll(() => {
      // logSpy.mockRestore()
      // jest.restoreAllMocks()
    })

    describe("tasks", () => {
      it("should contain tasks", done => {
        // given:
        const worker = new Worker()

        // when:
        for (let index = 0; index < 25; index += 1) {
          worker.enqueueTask({ data: index + 1 })
        }

        // then:
        expect(worker._tasks!.length).toEqual(25)
        expect(worker._tasks!.data).toMatchSnapshot()

        // when:
        worker.prepareBatch(10)

        // then:
        expect(worker._tasks!.length).toEqual(15)
        expect(worker._queue!.size).toEqual(10)

        // expect:
        worker.processBatch()
        setTimeout(done, 1000)
      })
    })
  })
})
