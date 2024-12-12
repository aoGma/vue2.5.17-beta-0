/* @flow */

import VNode, { createTextVNode } from 'core/vdom/vnode'
import { isFalse, isTrue, isDef, isUndef, isPrimitive } from 'shared/util'

// 模板编译器尝试通过在编译时静态分析模板来最小化规范化的需求。
//
// 对于普通的 HTML 标记，可以完全跳过规范化，因为生成的渲染函数保证返回 Array<VNode>。
// 有两种情况需要额外的规范化:

// 1. 当子节点包含组件时 - 因为函数式组件可能返回一个数组而不是单个根节点。
// 在这种情况下，只需要简单的规范化 - 如果任何子节点是数组，我们使用 Array.prototype.concat 将整个数组扁平化。
// 它保证只有 1 层深度，因为函数式组件已经规范化了它们自己的子节点。
export function simpleNormalizeChildren (children: any) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. 当子节点包含总是生成嵌套数组的结构时，例如 <template>、<slot>、v-for，
// 或者当子节点是用户通过手写的渲染函数/JSX 提供时。
// 在这种情况下，需要完全规范化以适应所有可能的子节点值类型。
export function normalizeChildren (children: any): ?Array<VNode> {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node): boolean {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children: any, nestedIndex?: string): Array<VNode> {
  const res = []
  let i, c, lastIndex, last
  for (i = 0; i < children.length; i++) {
    c = children[i]
    if (isUndef(c) || typeof c === 'boolean') continue
    lastIndex = res.length - 1
    last = res[lastIndex]
    // 嵌套
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`)
        // 合并相邻的文本节点
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]: any).text)
          c.shift()
        }
        res.push.apply(res, c)
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // 合并相邻的文本节点
        // 这对 SSR 水合是必要的，因为文本节点在渲染为 HTML 字符串时本质上是合并的
        res[lastIndex] = createTextVNode(last.text + c)
      } else if (c !== '') {
        // 将原始值转换为 vnode
        res.push(createTextVNode(c))
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // 合并相邻的文本节点
        res[lastIndex] = createTextVNode(last.text + c.text)
      } else {
        // 嵌套数组子节点的默认键（可能由 v-for 生成）
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = `__vlist${nestedIndex}_${i}__`
        }
        res.push(c)
      }
    }
  }
  return res
}
