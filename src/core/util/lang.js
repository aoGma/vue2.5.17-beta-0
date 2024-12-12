/* @flow */

/**
 * Check if a string starts with $ or _
 */
/**
 * 检查字符串是否以 $ 或 _ 开头
 * 用于判断一个字符串是否是保留字符
 * 
 * @param {string} str - 要检查的字符串
 * @returns {boolean} - 如果字符串以 $ 或 _ 开头返回 true,否则返回 false
 */
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
