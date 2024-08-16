import { Light } from './light.mjs'

import src_player from '../images/player.png'
import src_barrel from '../images/barrel.png'
import src_rock from '../images/rock.png'

const tiles = document.getElementById('tiles') as HTMLDivElement

let current_tile_type: string = 'player'

const PLACEABLE_TILES: { [key: string]: string } = {
  player: src_player,
  barrel: src_barrel,
  rock: src_rock,
}

for (const tile_name of Object.keys(PLACEABLE_TILES)) {
  const element = tiles.appendChild(Light.createElement('div', { 'light:style': Light.createStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '[$sub-color]', borderRadius: '[0.5ps]', width: '[2.5ps]', height: '[2.5ps]', cursor: 'pointer' }) }, [
    Light.createElement('img', { src: PLACEABLE_TILES[tile_name], 'light:style': Light.createStyle({ width: '[1.75ps]' }) })
  ]))

  element.addEventListener('click', () => current_tile_type = tile_name)
}

// Set The Current Tile Type
function get_current_tile_type (): string {
  return current_tile_type
}

export { get_current_tile_type }
