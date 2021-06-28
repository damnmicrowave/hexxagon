import { createContext, useCallback, useEffect, useState } from 'react'
import { Board, Header } from 'components'
import {
  cellsMatch,
  getCell,
  getHexDistance,
  hexDirections
} from 'components/utils'
import { Cell, CellsGrid, Game, Player } from 'components/types'

import './App.scss'

const generateEmptyGrid = (width: number): CellsGrid => {
  const grid: CellsGrid = {}

  // ~~ is a shorthand for Math.floor()
  const halfWidth = ~~(width / 2)

  // e.g. if grid width is 7, we iterate from -3 to 3
  for (let q = -halfWidth; q <= halfWidth; q++) {
    for (let r = -halfWidth; r <= halfWidth; r++) {
      // this ensures that all the cells are within halfSize radius from the center cell
      if (Math.abs(q + r) <= halfWidth) {
        grid[`${q}${r}`] = {
          q,
          r,
          highlighted: false,
          state: 'empty'
        }
      }
    }
  }

  // put initial states on the corners
  hexDirections.forEach(([q_dir, r_dir], index) => {
    grid[`${halfWidth * q_dir}${halfWidth * r_dir}`].state =
      index % 2 === 0 ? 'white' : 'black'
  })

  // remove 3 center cells
  delete grid['0-1']
  delete grid['10']
  delete grid['-11']
  return grid
}

export const GameContext = createContext<Game>({
  grid: {},
  currentPlayer: 'white',
  makeMove: () => {},
  selectCell: () => {}
})

export const App = () => {
  const makeMove = (targetCell: Cell) => {
    setGame(prevGameState => {
      const newGameState = { ...prevGameState }

      const cell = getCell(game, targetCell)
      cell.state = newGameState.currentPlayer

      // remove highlighting from all cells
      Object.values(newGameState.grid).forEach(c => {
        c.highlighted = false
      })

      // convert all opponent's neighbour cells into current player's color
      Object.values(newGameState.grid).forEach(c => {
        if (
          getHexDistance(cell, c) === 1 &&
          c.state !== 'empty' &&
          c.state !== newGameState.currentPlayer
        ) {
          c.state = newGameState.currentPlayer
        }
      })

      // clear selected cell if target cell isn't its neighbour
      if (
        newGameState.selectedCell &&
        getHexDistance(newGameState.selectedCell, cell) !== 1
      ) {
        getCell(game, newGameState.selectedCell).state = 'empty'
      }

      // change current player
      newGameState.currentPlayer =
        newGameState.currentPlayer === 'white' ? 'black' : 'white'

      return newGameState
    })
  }
  const selectCell = (cell: Cell) => {
    setGame(prevGameState => {
      const newGameState = { ...prevGameState }

      // select the cell
      newGameState.selectedCell =
        // we deselect cell if it is already selected
        newGameState.selectedCell && cellsMatch(newGameState.selectedCell, cell)
          ? undefined
          : cell

      // remove highlighting from all cells
      Object.values(newGameState.grid).forEach(c => {
        c.highlighted = false
      })

      if (newGameState.selectedCell) {
        // highlight neighbour cells if cell is selected
        Object.values(newGameState.grid).forEach(c => {
          if (getHexDistance(cell, c) === 1 && c.state === 'empty') {
            c.highlighted = true
            c.highlightColor = '#00ff00'
            // highlight next row of cells
          } else if (getHexDistance(cell, c) === 2 && c.state === 'empty') {
            c.highlighted = true
            c.highlightColor = '#ffff00'
          }
        })
      }

      return newGameState
    })
  }

  const initialGameState = {
    grid: generateEmptyGrid(9),
    currentPlayer: 'white' as Player,
    makeMove,
    selectCell
  }
  const [game, setGame] = useState<Game>(initialGameState)

  const getWinner: () => Player | null = useCallback(() => {
    const blackCells = Object.values(game.grid).filter(c => c.state === 'black')
    const whiteCells = Object.values(game.grid).filter(c => c.state === 'white')
    const emptyCells = Object.values(game.grid).filter(c => c.state === 'empty')
    const allCells = Object.values(game.grid)

    // if no cells of one player left
    if (!blackCells.length) return 'white'
    if (!whiteCells.length) return 'black'

    // if current player doesn't have any more moves
    if (
      emptyCells.every(e => {
        const neighbours = allCells.filter(c => getHexDistance(e, c) <= 2)
        return neighbours.every(n => n.state !== game.currentPlayer)
      })
    )
      return blackCells.length > whiteCells.length ? 'black' : 'white'

    return null
  }, [game])

  useEffect(() => {
    const winner = getWinner()
    if (winner) {
      alert(`${winner} wins !`)
      window.location.reload()
    }
  }, [getWinner])

  return (
    <GameContext.Provider value={game}>
      <Header currentPlayer={game.currentPlayer} />
      <Board grid={game.grid} />
    </GameContext.Provider>
  )
}
