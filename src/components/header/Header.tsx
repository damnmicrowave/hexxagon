import classnames from 'classnames'
import { Player } from '../types'

import styles from './Header.module.scss'

export const Header = (props: { currentPlayer: Player }) => {
  return (
    <div className={classnames(styles.header, styles[props.currentPlayer])}>
      HEXXAGON
    </div>
  )
}
