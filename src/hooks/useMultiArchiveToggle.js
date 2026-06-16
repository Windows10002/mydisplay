import { useCallback, useState } from 'react'

/** 档案交互：多项可同时展开，再次点击同一项才关闭 */
export function useMultiArchiveToggle() {
  const [activeKeys, setActiveKeys] = useState(() => new Set())

  const toggle = useCallback((key) => {
    setActiveKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const isActive = useCallback((key) => activeKeys.has(key), [activeKeys])

  return [activeKeys, toggle, isActive]
}
