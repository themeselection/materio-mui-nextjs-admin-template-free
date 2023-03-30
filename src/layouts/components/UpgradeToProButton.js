// ** React Import
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { usePopper } from 'react-popper'

const BuyNowButton = () => {
  // ** States
  const [open, setOpen] = useState(false)
  const [popperElement, setPopperElement] = useState(null)
  const [referenceElement, setReferenceElement] = useState(null)

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: 'top-end'
  })

  const handleOpen = () => {
    setOpen(true)
    update ? update() : null
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Button
        component='a'
        target='_blank'
        variant='contained'
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        ref={e => setReferenceElement(e)}
        href='https://webidoochain.com'
        sx={{
          backgroundColor: '#ff3e1d',
          boxShadow: '0 1px 20px 1px #ff3e1d',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#e6381a'
          }
        }}
      >
        Visita il nostro Sito
      </Button>
      <Fade in={open} timeout={700}>
        <Box
          style={styles.popper}
          ref={setPopperElement}
          {...attributes.popper}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          sx={{ pb: 4, minWidth: theme => (theme.breakpoints.down('sm') ? 400 : 300) }}
        >
          <Paper elevation={9} sx={{ borderRadius: 1, overflow: 'hidden' }}>
            <a
              target='_blank'
              rel='noreferrer'
              href='webidoochain.com'
            >
              <img width='100%' alt='materio-pro-banner' src='/images/misc/webidoochain-banner.jpg' />
            </a>
            <CardContent>
              <Typography sx={{ mb: 4 }} variant='h6'>
                WebidooChain - Usa la blockchain in modo semplice
              </Typography>
              <Typography sx={{ mb: 4 }} variant='body2'>
                Entra all'interno del Web3 con dei semplici click.
              </Typography>
              <Typography sx={{ mb: 4 }} variant='body2'>
                Scrivici se desideri feature personalizzate.
              </Typography>
              <Button
                component='a'
                sx={{ mr: 4 }}
                target='_blank'
                variant='contained'
                href='webidoochain.com'
              >
                Scrivici
              </Button>
              <Button
                component='a'
                target='_blank'
                variant='outlined'
                href='webidoochain.com'
              >
                Entra nel Web3
              </Button>
            </CardContent>
          </Paper>
        </Box>
      </Fade>
    </Box>
  )
}

export default BuyNowButton
