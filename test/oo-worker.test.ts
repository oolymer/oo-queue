import { Worker } from "../src/oo-worker"

describe("oo-worker", () => {
  describe("logs", () => {
    const logSpy = jest.spyOn(console, "log")
    logSpy.mockName("console.log")
    logSpy.mockReturnThis()

    afterEach(() => {
      expect(logSpy.mock.calls).toMatchSnapshot()
      logSpy.mockClear()
    })

    afterAll(() => {
      logSpy.mockRestore()
      jest.restoreAllMocks()
    })

    describe("tasks", () => {
      it("should contain tasks", done => {
        // when:
        const worker = new Worker()

        // then:
        expect(worker._tasks!.data).toMatchSnapshot()

        // and:
        worker.process()
        setTimeout(done, 1000)
      })
    })
  })
})
