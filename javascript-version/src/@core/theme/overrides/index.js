// Override Imports
import Accordion from './accordion'
import Alerts from './alerts'
import Autocomplete from './autocomplete'
import avatar from './avatar'
import backdrop from './backdrop'
import badges from './badges'
import breadcrumbs from './breadcrumbs'
import button from './button'
import buttonGroup from './button-group'
import card from './card'
import Checkbox from './checkbox'
import chip from './chip'
import dialog from './dialog'
import drawer from './drawer'
import fab from './fab'
import formControlLabel from './form-control-label'
import iconButton from './icon-button'
import input from './input'
import list from './list'
import menu from './menu'
import pagination from './pagination'
import paper from './paper'
import popover from './popover'
import progress from './progress'
import Radio from './radio'
import Rating from './rating'
import Select from './select'
import slider from './slider'
import snackbar from './snackbar'
import switchOverrides from './switch'
import tablePagination from './table-pagination'
import tabs from './tabs'
import timeline from './timeline'
import toggleButton from './toggle-button'
import tooltip from './tooltip'
import typography from './typography'

const overrides = () => {
  const skin = 'default'

  return Object.assign(
    {},
    Accordion(skin),
    Alerts,
    Autocomplete(skin),
    avatar,
    backdrop,
    badges,
    breadcrumbs,
    button,
    buttonGroup,
    card(skin),
    Checkbox,
    chip,
    dialog(skin),
    drawer(skin),
    fab,
    formControlLabel,
    iconButton,
    input,
    list,
    menu(skin),
    pagination,
    paper,
    popover(skin),
    progress,
    Radio,
    Rating,
    Select,
    slider,
    snackbar(skin),
    switchOverrides,
    tablePagination,
    tabs,
    timeline,
    toggleButton,
    tooltip,
    typography
  )
}

export default overrides
