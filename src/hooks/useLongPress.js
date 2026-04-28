import { useRef, useCallback } from 'react'

export function useLongPress(onLongPress, onClick, { delay = 500 } = {}) {
  const timeout = useRef()
  const target = useRef()

  const start = useCallback(
    (event) => {
      target.current = event.target
      timeout.current = setTimeout(() => {
        onLongPress(event)
      }, delay)
    },
    [onLongPress, delay]
  )

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current)
      if (shouldTriggerClick && onClick && event.target === target.current) {
        onClick(event)
      }
    },
    [onClick]
  )

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: clear,
  }
}
