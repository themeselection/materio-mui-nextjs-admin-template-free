// Component Imports
import NotFound from '@views/NotFound'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const Error = () => {
  // Vars
  const mode = getServerMode()

  return <NotFound mode={mode} />
}

export default Error
