// Component Imports
import ErrorClient from './pageClient'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const Error = ({ searchParams }) => {
  // Vars
  const mode = getServerMode()
  const code = searchParams?.code || null
  const from = searchParams?.from || null

  return <ErrorClient mode={mode} code={code} from={from} />
}

export default Error
