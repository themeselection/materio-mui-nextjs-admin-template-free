import * as React from 'react'
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

// import Check from '@mui/icons-material/Check';
// import SettingsIcon from '@mui/icons-material/Settings';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import { AlertOutline, Check, FileSettingsOutline, FolderTableOutline } from 'mdi-material-ui'
import { Box, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { UserData, useData } from 'src/@core/layouts/HipotecarLayout'
import Link from 'next/link'

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1
  }
}))

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  transition: '1s',
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#784af4' // Active color
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4', // Completed icon color
    zIndex: 1,
    fontSize: 18
  },
  '& .QontoStepIcon-completedIcon:hover': {
    color: 'gray', // Completed icon color
    zIndex: 1,
    cursor: 'pointer',
    transition: '1s',
    fontSize: 18,
    shadow: '1px 1px 1px 1px'
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor'
  }
}))

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check className='QontoStepIcon-completedIcon' /> : <div className='QontoStepIcon-circle' />}
    </QontoStepIconRoot>
  )
}

export const steps = ['Nombre', 'Test de riesgo', 'Preferencias', 'Resultados'] as const
export const stepLinks = ['/name', '/risk', '/preferences', '/comparison']

export const getActiveStep = (data: UserData) => {
  if (data.budget && data.creditType && data.duration) {
    return 3
  }

  if (data.riskAssesmentPassed === true) {
    return 2
  }

  if (data.name) {
    return 1
  }

  return 0
}

export default function ProgressBar() {
  const context = useData()
  const theme = useTheme()

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const activeStep = context?.data ? getActiveStep(context?.data.user) : 0

  return (
    <div style={{ padding: isSmallScreen ? '1em' : '3em', width: "100%", overflow: "scroll" }}>
      <Stack sx={{ width: '100%' }} spacing={4}>
        <Stepper alternativeLabel={!isSmallScreen} activeStep={activeStep} connector={<QontoConnector />}>
          {steps.map((label, index) => (
            <Step key={label}>
              {activeStep >= index ? (
                <Link href={stepLinks[index]} key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                </Link>
              ) : (
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              )}
            </Step>
          ))}
        </Stepper>
      </Stack>
    </div>
  )
}
