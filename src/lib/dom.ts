export function createDOM<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: (el: HTMLElementTagNameMap[K]) => void | undefined
): HTMLElementTagNameMap[K] {
  const dom = document.createElement(tag);
  options?.(dom);
  return dom;
}
