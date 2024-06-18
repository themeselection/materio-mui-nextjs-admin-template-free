// Component Imports
import UnderMaintenance from '@views/pages/misc/UnderMaintenance'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const UnderMaintenancePage = () => {
  // Vars
  const mode = getServerMode()

  return <UnderMaintenance mode={mode} />
}

export default UnderMaintenancePage
