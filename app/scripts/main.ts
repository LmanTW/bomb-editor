import { load_fields, save_fields } from './fields.js'
import { load_map, save_map } from './map.js'
import { Light } from './light.mjs'

new Light(document.body)

const button_load = document.getElementById('button_load')!
const button_save = document.getElementById('button_save')!

let file_name!: string

button_load.addEventListener('click', () => {
  const input = Light.createElement('input', { type: 'file', accept: '.json' }) as HTMLInputElement

  input.addEventListener('change', () => {
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

    file_name = input.files![0].name

    reader.readAsText(input.files![0])
  }, { once: true })

  input.click()
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

  console.log(fields, tiles)
})
