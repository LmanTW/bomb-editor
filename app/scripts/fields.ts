import { set_map_size, set_explod_range } from './map.js'

const fields_info: { [key: string]: { input: string, min: number, max: number, default: number }} = {
  player_speed: { input: 'input_player_speed', min: 1, max: 999, default: 5 },
  player_bombs: { input: 'input_player_bombs', min: 1, max: 999, default: 2 },

  bomb_countdown: { input: 'input_bomb_countdown', min: 1, max: 999, default: 150 },
  bomb_explode_range: { input: 'input_bomb_explode_range', min: 1, max: 999, default: 125 },

  width: { input: 'input_width', min: 1, max: 99, default: 15 },
  height: { input: 'input_height', min: 1, max: 99, default: 9 }
}

set_map_size(fields_info.width.default, fields_info.height.default)
set_explod_range(fields_info.bomb_explode_range.default)

for (const field_name of Object.keys(fields_info)) {
  const input = document.getElementById(fields_info[field_name].input) as HTMLInputElement

  input.value = fields_info[field_name].default.toString()

  input.addEventListener('change', () => {
    const characters = input.value.split('')

    for (let i = characters.length - 1; i >= 0; i--) {
      if (!'-0123456789'.includes(characters[i])) characters.splice(i, 1)
    }

    let value = parseInt(characters.join(''))

    if (value < fields_info[field_name].min) value = fields_info[field_name].min
    if (value > fields_info[field_name].max) value = fields_info[field_name].max

    input.value = value.toString()

    if (field_name === 'bomb_explode_range') set_explod_range(value)
    else if (field_name === 'width') set_map_size(value, undefined)
    else if (field_name === 'height') set_map_size(undefined, value)
  })
}

// Load Fields
function load_fields (fields: { [key: string]: number }): void {
  for (const field_name of Object.keys(fields_info)) {
    const input = document.getElementById(fields_info[field_name].input) as HTMLInputElement
    const value = (fields[field_name] === undefined) ? fields_info[field_name].default : fields[field_name]

    input.value = value.toString()

    if (field_name === 'bomb_explode_range') set_explod_range(value)
    else if (field_name === 'width') set_map_size(value, undefined)
    else if (field_name === 'height') set_map_size(undefined, value)
  }
}

// Save Fields
function save_fields (): { [key: string]: number } {
  const fields: { [key: string]: number } = {}

  for (const field_name of Object.keys(fields_info)) {
    const input = document.getElementById(fields_info[field_name].input) as HTMLInputElement

    fields[field_name] = parseInt(input.value)
  }

  return fields
}

export { load_fields, save_fields }
