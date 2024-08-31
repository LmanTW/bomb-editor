import { Light } from './light.mjs'

import src_player from '../images/player.png'
import src_barrel from '../images/barrel.png'
import src_rock2 from '../images/rock2.png'
import src_rock from '../images/rock.png'

// Load An Image
function load_image (src: string): HTMLImageElement {
  const image = new Image()

  image.src = src

  return image
}

const TILES: HTMLImageElement[] = [
  load_image(src_barrel),
  load_image(src_rock),
  load_image(src_rock2),
  load_image(src_player)
]

// Export The Tileset As An Image
function export_tileset_as_image (): void {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = 64 * 5
  canvas.height = Math.ceil(TILES.length / 5) * 64

  let x = 0
  let y = 0

  for (let i = 0; i < TILES.length; i++) {
    ctx.drawImage(TILES[i], x * 64, y * 64, 64, 64)

    x++

    if (x >= 5) {
      x = 0
      y++
    }
  }

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob!)

    const download = Light.createElement('a', {
      href: url,
      download: 'map.png'
    }) 

    download.click()

    URL.revokeObjectURL(url)
  })
}

export { export_tileset_as_image }
