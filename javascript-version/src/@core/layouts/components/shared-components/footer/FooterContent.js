// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const FooterContent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { md: 'row', xs: 'column-reverse' },
        gap: 4,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Typography sx={{ textAlign: 'center' }}>
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` by `}
        <Link target='_blank' href='https://themeselection.com/'>
          ThemeSelection
        </Link>
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: { xs: 3, sm: 4 },
          fontSize: { xs: 14, sm: 16 },
          justifyContent: 'center'
        }}
      >
        <Link
          target='_blank'
          href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/blob/main/LICENSE'
        >
          MIT License
        </Link>
        <Link target='_blank' href='https://themeselection.com/'>
          More Themes
        </Link>
        <Link
          target='_blank'
          href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/blob/main/README.md'
        >
          Documentation
        </Link>
        <Link
          target='_blank'
          href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/issues'
        >
          Support
        </Link>
      </Box>
    </Box>
  )
}

export default FooterContent
