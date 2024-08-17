import { get_current_tile_type } from './tiles.js'
import { Light } from './light.mjs'

import src_ground_light from '../images/ground_light.png'
import src_ground_dark from '../images/ground_dark.png'
import src_player from '../images/player.png'
import src_barrel from '../images/barrel.png'
import src_rock2 from '../images/rock2.png'
import src_rock from '../images/rock.png'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

let size: { width: number, height: number } = { width: 0, height: 0 }
let tile_size: number = 0
let explod_range : number = 0

let background_tiles: string[] = []
let foreground_tiles: Map<string, string> = new Map()

let mouse: { press: boolean, x: number, y: number } = { press: false, x: 0, y: 0 }
let place_mode: undefined | 'set' | 'reset' = undefined

// Load An Image
function load_image (src: string): HTMLImageElement {
  const image = new Image()

  image.src = src

  return image
}

const TILE_TYPES: { [key: string]: { image: HTMLImageElement, max: number }} = {
  ground_light: { image: load_image(src_ground_light), max: Infinity },
  ground_dark: { image: load_image(src_ground_dark), max: Infinity },

  barrel: { image: load_image(src_barrel), max: Infinity },
  rock: { image: load_image(src_rock), max: Infinity },
  rock2: { image: load_image(src_rock2), max: Infinity },

  player: { image: load_image(src_player), max: 4 }
}

// Update The Size Of The Canvas
function update_canvas_size (): void {
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width
  canvas.height = rect.height

  calculate_tile_size()
}

// Set The Size Of The Map
function set_map_size (width: undefined | number, height: undefined | number): void {
  if (width !== undefined) size.width = width
  if (height !== undefined) size.height = height

  for (let i = 0; i < size.width * size.height; i++) {
    if (Math.round(Math.random() * 2) > 0) background_tiles.push('ground_dark')
    else background_tiles.push('ground_light')
  }

  calculate_tile_size()
}

// Set The Range Of The Explosion
function set_explod_range (range: number): void {
  explod_range = range
}

// Calculate The Tile Size
function calculate_tile_size (): void {
  if (canvas.width > canvas.height) tile_size = canvas.width / (size.width + 1)
  else tile_size = canvas.height / (size.height + 1)

  if (tile_size * size.width > canvas.width) tile_size = canvas.width / (size.width + 1)
  else if (tile_size * size.height > canvas.height) tile_size = canvas.height / (size.height + 1)

  tile_size = Math.floor(tile_size * 0.99999)
}

// Load The Map
function load_map (tiles: { type: string, x: number, y: number }[]) {
  foreground_tiles.clear()

  for (const tile of tiles) foreground_tiles.set(`${tile.x},${tile.y}`, tile.type)
}

// Save The Map
function save_map (): { type: string, x: number, y: number }[] {
  const tiles: { type: string, x: number, y: number }[] = []

  foreground_tiles.forEach((tile_type, key) => {
    const x = parseInt(key.split(',')[0])
    const y = parseInt(key.split(',')[1])

    if (x >= 0 && y >= 0 && x < size.width && y < size.height) tiles.push({ type: tile_type, x, y })
  })

  return tiles
}

// Export The Map As An Image
function export_map_as_image (): void {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob!)

    const download = Light.createElement('a', {
      href: url,
      download: 'image.png'
    }) 

    download.click()

    URL.revokeObjectURL(url)
  })
}

// Get Tile Amount
function get_tile_amount (type: string): number {
  let amount: number = 0

  foreground_tiles.forEach((tile_type) => {
    if (tile_type === type) amount++
  })

  return amount
}

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'rgba(255, 0, 0, 0.1)'

  const render_offset_x = Math.round((canvas.width / 2) - ((size.width / 2) * tile_size))
  const render_offset_y = Math.round((canvas.height / 2) - ((size.height / 2) * tile_size))

  for (let y = 0; y < size.height; y++) {
    for (let x = 0; x < size.width; x++) {
      ctx.drawImage(
        TILE_TYPES[background_tiles[x + (y * size.width)]].image,

        render_offset_x + (x * tile_size),
        render_offset_y + (y * tile_size),

        tile_size,
        tile_size
      )

      if (foreground_tiles.has(`${x},${y}`)) {
        const tile_type = foreground_tiles.get(`${x},${y}`)!

        ctx.drawImage(
          TILE_TYPES[tile_type].image,

          render_offset_x + (x * tile_size),
          render_offset_y + (y * tile_size),

          tile_size,
          tile_size
        )

        if (tile_type === 'player') {
          ctx.arc(
            render_offset_x + ((x * tile_size) + (tile_size / 2)),
            render_offset_y + ((y * tile_size) + (tile_size / 2)),
            (tile_size / 64) * explod_range,
            0,
            2 * Math.PI
          )

          ctx.closePath()
        }
      }

      if (Math.round(((mouse.x - (tile_size / 2)) - render_offset_x) / tile_size) === x && Math.round(((mouse.y - (tile_size / 2)) - render_offset_y) / tile_size) === y) {
        ctx.filter = 'opacity(0.5)'

        const current_tile_type = get_current_tile_type()

        ctx.drawImage(
          TILE_TYPES[current_tile_type].image,

          render_offset_x + (x * tile_size),
          render_offset_y + (y * tile_size),

          tile_size,
          tile_size
        )

        ctx.filter = 'none'

        if (mouse.press) {
          if (place_mode === undefined) place_mode = (foreground_tiles.has(`${x},${y}`)) ? 'reset' : 'set'

          if (place_mode === 'set' && get_tile_amount(current_tile_type) < TILE_TYPES[current_tile_type].max) foreground_tiles.set(`${x},${y}`, current_tile_type)
          else if (place_mode === 'reset') foreground_tiles.delete(`${x},${y}`)
        }
      }
    }
  }

  ctx.fill()

  ctx.beginPath()
}, 1000 / 30)

setTimeout(update_canvas_size, 10)

window.addEventListener('resize', update_canvas_size)
window.addEventListener('mousemove', (event) => {
  mouse.x = event.offsetX
  mouse.y = event.offsetY
})
window.addEventListener('mousedown', () => mouse.press = true)
window.addEventListener('mouseup', () => {
  mouse.press = false

  place_mode = undefined
})

export { set_map_size, set_explod_range, load_map, save_map, export_map_as_image, TILE_TYPES }
