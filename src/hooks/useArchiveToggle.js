import { useCallback, useRef, useState } from 'react'

/** 档案交互：首次点击展开，再次点击同一项才关闭 */
export function useArchiveToggle(initial = null) {
  const [activeKey, setActiveKey] = useState(initial)
  const lockRef = useRef(false)

  const toggle = useCallback((key) => {
    if (lockRef.current) return
    lockRef.current = true
    setActiveKey((prev) => (prev === key ? null : key))
    requestAnimationFrame(() => {
      lockRef.current = false
    })
  }, [])

  return [activeKey, toggle]
}
