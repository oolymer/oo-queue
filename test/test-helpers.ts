export class Spies {
  static consoleLog(matchCalls: boolean = false): jest.SpyInstance<Console["log"]> {
    const spy = jest.spyOn(console, "log")
    spy.mockName("console.log")
    // spy.mockReturnThis()

    afterEach(() => {
      if (matchCalls) {
        expect(spy.mock.calls).toMatchSnapshot()
      }
      spy.mockClear()
    })

    afterAll(() => {
      spy.mockRestore()
    })

    return spy
  }
}
