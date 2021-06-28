import { Cell } from 'components'
import { CellsGrid } from '../types'

import styles from './Board.module.scss'

export const Board = (props: { grid: CellsGrid }) => {
  return (
    <div className={styles.board}>
      {Object.values(props.grid).map(cell => (
        // {...cell} is a shorthand for q={cell.q} r={cell.r} state={cell.state} etc...
        <Cell key={`${cell.q}${cell.r}`} {...cell} />
      ))}
    </div>
  )
}
