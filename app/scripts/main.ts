import { load_map, save_map, export_map_as_image } from './map.js'
import { load_fields, save_fields } from './fields.js'
import { export_tileset_as_image } from './tileset.js'
import { Light } from './light.mjs'

new Light(document.body)

const canvas = document.getElementById('canvas')!
const button_load = document.getElementById('button_load')!
const button_save = document.getElementById('button_save')!
const button_map_export_as_image = document.getElementById('button_map_export_as_image')!
const button_tileset_export_as_image = document.getElementById('button_tileset_export_as_image')!

let file_name!: string

// Load A File
function load_file (file: File): void {
  const reader = new FileReader()

  reader.addEventListener('load', () => {
    const data = JSON.parse(reader.result as string)
    const fields: { [key: string]: number } = {}

    if (typeof data.rules === 'object') {
      if (typeof data.rules.player_speed === 'number') fields.player_speed = data.rules.player_speed
      if (typeof data.rules.player_bombs === 'number') fields.player_bombs = data.rules.player_bombs
      if (typeof data.rules.bomb_countdown === 'number') fields.bomb_countdown = data.rules.bomb_countdown
      if (typeof data.rules.bomb_explode_range === 'number') fields.bomb_explode_range = data.rules.bomb_explode_range
    }

    if (typeof data.map === 'object') {
      if (typeof data.map.width === 'number') fields.width = data.map.width
      if (typeof data.map.height === 'number') fields.height = data.map.height
    }

    load_fields(fields)

    if (data.map.tiles !== undefined) load_map(data.map.tiles)
  })

  file_name = file.name

  reader.readAsText(file)
}

button_load.addEventListener('click', () => {
  const input = Light.createElement('input', { type: 'file', accept: '.json' }) as HTMLInputElement

  input.addEventListener('change', () => load_file(input.files![0]), { once: true })

  input.click()
})

canvas.addEventListener('dragover', (event) => event.preventDefault())
canvas.addEventListener('drop', (event) => {
  event.preventDefault()

  const file = event.dataTransfer!.files[0]

  if (file.type === 'application/json') load_file(file)
})

button_save.addEventListener('click', () => {
  const fields = save_fields()
  const tiles = save_map()

  const url = URL.createObjectURL(new Blob([JSON.stringify({
    rules: {
      player_speed: fields.player_speed,
      player_bombs: fields.player_bombs,

      bomb_countdown: fields.bomb_countdown,
      bomb_explode_range: fields.bomb_explode_range
    },
    map: {
      width: fields.width,
      height: fields.height,

      tiles
    }
  }, null, 2)], { type: 'application/json' }))

  const download = Light.createElement('a', {
    href: url,
    download: (file_name === undefined) ? 'level.json' : file_name
  }) 

  download.click()

  URL.revokeObjectURL(url)
})

button_map_export_as_image.addEventListener('click', export_map_as_image)
button_tileset_export_as_image.addEventListener('click', export_tileset_as_image)
