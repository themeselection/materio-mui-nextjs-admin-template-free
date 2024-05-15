// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Grid from '@mui/material/Grid'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: '7em',
        marginLeft: '7em'
      }}
    >
      <Typography sx={{ display: { xs: 'none', md: 'block' } }} color='text.secondary'>
        {`Sitio con fines informativos, no representa consejo de inversion.`}
      </Typography>

      <Typography sx={{ display: { xs: 'none', md: 'block' } }} color='text.secondary'>
        {`Comentarios y sugerencias a `}
        <Link href='https://twitter.com/mgrabina' target='_blank' rel='noreferrer' color='inherit'>
          @mgrabina
        </Link>
      </Typography>
    </Box>
  )
}

export default FooterContent
