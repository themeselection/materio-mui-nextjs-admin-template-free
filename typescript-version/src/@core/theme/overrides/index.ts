// Override Imports
import Accordion from './accordion'
import Autocomplete from './autocomplete'
import avatar from './avatar'
import button from './button'
import chip from './chip'
import input from './input'
import paper from './paper'
import Rating from './rating'
import tablePagination from './table-pagination'
import tabs from './tabs'
import timeline from './timeline'
import tooltip from './tooltip'
import typography from './typography'

const overrides = () => {
  return Object.assign(
    {},
    Accordion(),
    Autocomplete,
    avatar,
    button,
    chip,
    input,
    paper,
    Rating,
    tablePagination,
    tabs,
    timeline,
    tooltip,
    typography
  )
}

export default overrides
