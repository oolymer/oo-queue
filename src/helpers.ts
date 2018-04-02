export function _require(condition: boolean, lazyMessage?: () => string) {
  if (!condition) {
    if (lazyMessage) {
      throw lazyMessage()
    }
    throw "illegal argument"
  }
}

export function _requireNotNil(value: any, lazyMessage?: () => string) {
  if (_isNil(value)) {
    if (lazyMessage) {
      throw lazyMessage()
    }
    throw "illegal argument"
  }
}

export function _isNil(value: any): boolean {
  return value === null || value === undefined
}
