export type Player = 'white' | 'black'

export type Cell = {
  q: number
  r: number
  state: 'empty' | Player
  highlighted: boolean
  highlightColor?: string
}

export type CellsGrid = {
  [coords: string]: Cell
}

export type Game = {
  currentPlayer: Player
  grid: CellsGrid
  selectedCell?: Cell
  selectCell: (cell: Cell) => void
  makeMove: (targetCell: Cell) => void
}
