// MUI Imports
import type { StepIconProps } from '@mui/material/StepIcon'

// Third-party Imports
import classnames from 'classnames'

// Style Imports
import styles from './styles.module.css'

const StepperCustomDot = (props: StepIconProps) => {
  // Props
  const { active, completed, error } = props

  if (error) {
    return <i className='ri-alert-fill text-xl scale-[1.2] text-error' />
  } else if (completed) {
    return (
      <div
        className={classnames(styles.stepperCustomDot, 'flex items-center justify-center', {
          [styles.completedStepperCustomDot]: completed
        })}
      >
        <i className='ri-check-line text-sm text-white' />
      </div>
    )
  } else {
    return <div className={classnames(styles.stepperCustomDot, { [styles.activeStepperCustomDot]: active })} />
  }
}

export default StepperCustomDot
