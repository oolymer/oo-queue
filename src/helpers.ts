export function _check(condition: boolean, lazyMessage?: () => string) {
  if (!condition) {
    if (lazyMessage) {
      throw new Error(lazyMessage())
    }
    throw new Error("illegal argument")
  }
}

export function _checkNotNil(value: any, lazyMessage?: () => string) {
  if (_isNil(value)) {
    if (lazyMessage) {
      throw new Error(lazyMessage())
    }
    throw new Error("illegal argument")
  }
}

export function _isNil(value: any): boolean {
  return value === null || value === undefined
}
