import { Cell, Game } from './types'

// this function checks if given coordinates are inside a hexagon
export const isInsideHex = (coords: number[], hexBoundingRect: DOMRect) => {
  const [x, y] = coords

  // get hexagon's bounding rectangle position offsets, width and height
  const { left, top, width, height } = hexBoundingRect
  // calculate hexagon's center coordinates
  const hexCenterX = width / 2 + left
  const hexCenterY = height / 2 + top

  // use the formula from this article: http://www.playchilla.com/how-to-check-if-a-point-is-inside-a-hexagon
  const [h, v] = [width / 2, height / 4]

  const quadrantX = Math.abs(x - hexCenterX)
  const quadrantY = Math.abs(y - hexCenterY)

  if (quadrantX > h || quadrantY > v * 2) return false
  return 2 * v * h - v * quadrantX - h * quadrantY >= 0
}

// returns true if cells' coordinates are the same
export const cellsMatch = (cell1: Cell, cell2: Cell) =>
  cell1.r === cell2.r && cell1.q === cell2.q

export const getCell = (
  game: Game,
  cell?: Cell,
  coords?: { q: number; r: number }
) => {
  if (coords) {
    return game.grid[`${coords.q}${coords.r}`]
  }
  return game.grid[`${cell?.q}${cell?.r}`]
}

// these are six axial directions, see this: https://www.redblobgames.com/grids/hexagons/#neighbors-axial
export const hexDirections = [
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [0, 1]
]

// this returns distance between two cells, see this: https://www.redblobgames.com/grids/hexagons/#distances-axial
export const getHexDistance = (cell1: Cell, cell2: Cell) =>
  (Math.abs(cell1.q - cell2.q) +
    Math.abs(cell1.q + cell1.r - cell2.q - cell2.r) +
    Math.abs(cell1.r - cell2.r)) /
  2
