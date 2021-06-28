import React, { useCallback, useContext, useEffect, useRef } from 'react'
import classnames from 'classnames'
import { isInsideHex } from '../utils'
import { GameContext } from 'app/App'
import { Cell as CellProps } from '../types'

import styles from './Cell.module.scss'

export const Cell = (props: CellProps) => {
  const game = useContext(GameContext)

  const cellBox = useRef<HTMLDivElement>(null)
  // this function adds 'hovered' class to the cell if it's being hovered with a mouse
  const onHover = useCallback(
    (e: MouseEvent) => {
      const cell = cellBox.current
      if (!cell) return

      const mouseCoords = [e.clientX, e.clientY]
      const cellBoundingRect = cell.getBoundingClientRect()
      if (
        isInsideHex(mouseCoords, cellBoundingRect) &&
        (cell.classList.contains(styles[game.currentPlayer]) ||
          cell.classList.contains(styles.highlighted))
      ) {
        cell.classList.add(styles.hovered)
      } else {
        cell.classList.remove(styles.hovered)
      }
    },
    [game.currentPlayer]
  )

  useEffect(() => {
    // here we tell js to run our onHover function every time we move the cursor
    // this is also called "event listener"
    window.addEventListener('mousemove', onHover)
    // we also call onHover on every turn

    // remove event listener when component gets unmounted (it's a good practise)
    return () => window.removeEventListener('mousemove', onHover)
  }, [onHover])

  const { q, r, state, highlighted, highlightColor } = props
  return (
    <div
      ref={cellBox}
      className={classnames(styles.cellBox, styles[state], {
        [styles.highlighted]: highlighted
      })}
      onClick={() => {
        if (highlighted) {
          game.makeMove(props)
        } else {
          game.selectCell(props)
        }
      }}
      style={
        {
          '--q': q,
          '--r': r
        } as React.CSSProperties // without this TypeScript won't allow setting css-variables
      }
    >
      <div className={styles.hexagonBox}>
        <div className={styles.hexagon} />
        {highlighted && (
          <div
            style={{ backgroundColor: highlightColor }}
            className={styles.highlighting}
          />
        )}
      </div>
    </div>
  )
}
