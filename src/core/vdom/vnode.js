/* @flow */

export default class VNode {
  // 节点标签名，例如 'div', 'span' 等
  tag: string | void;
  // 节点的数据对象，包含属性、事件等信息
  data: VNodeData | void;
  // 子节点数组
  children: ?Array<VNode>;
  // 文本内容
  text: string | void;
  // 对应的真实 DOM 节点
  elm: Node | void;
  // 命名空间
  ns: string | void;
  // 组件的上下文，指向该组件的 Vue 实例
  context: Component | void;
  // 节点的唯一标识，用于优化 diff 算法
  key: string | number | void;
  // 组件的选项，包含组件的 props、events 等信息
  componentOptions: VNodeComponentOptions | void;
  // 组件实例
  componentInstance: Component | void;
  // 组件的占位节点
  parent: VNode | void;

  // strictly internal
  // 是否包含原始 HTML（仅服务端渲染使用）
  raw: boolean;
  // 是否是静态节点（静态节点可以被优化）
  isStatic: boolean;
  // 用于确定是否作为根节点插入
  isRootInsert: boolean;
  // 是否是注释节点
  isComment: boolean;
  // 是否是克隆节点
  isCloned: boolean;
  // 是否是 v-once 节点（只渲染一次）
  isOnce: boolean;
  // 异步组件工厂函数
  asyncFactory: Function | void;
  // 异步组件的元数据
  // 异步组件的元数据，用于存储异步组件的加载状态和错误信息
  asyncMeta: Object | void;
  // 标识是否是异步组件的占位符节点
  isAsyncPlaceholder: boolean;
  // 服务端渲染上下文对象，用于服务端渲染时传递数据
  ssrContext: Object | void;
  // 函数式组件的上下文，指向真实的 Vue 实例
  fnContext: Component | void; // real context vm for functional nodes
  // 函数式组件的选项配置，用于服务端渲染缓存
  fnOptions: ?ComponentOptions; // for SSR caching
  // 函数式组件的作用域 ID，用于 CSS 作用域隔离
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}

// 创建一个空的 VNode，通常用于创建注释节点
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}

// 创建一个文本节点的 VNode
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// 克隆一个 VNode
// 用于静态节点和插槽节点的优化，因为它们可能在多次渲染中被重用
// 克隆它们可以避免 DOM 操作依赖它们的 elm 引用时出错
export function cloneVNode (vnode: VNode): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.fnContext = vnode.fnContext
  cloned.fnOptions = vnode.fnOptions
  cloned.fnScopeId = vnode.fnScopeId
  cloned.asyncMeta = vnode.asyncMeta
  cloned.isCloned = true
  return cloned
}
