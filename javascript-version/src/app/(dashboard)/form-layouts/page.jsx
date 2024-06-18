// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import FormLayoutsBasic from '@views/form-layouts/FormLayoutsBasic'
import FormLayoutsIcon from '@views/form-layouts/FormLayoutsIcons'
import FormLayoutsAlignment from '@views/form-layouts/FormLayoutsAlignment'

const FormLayouts = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <FormLayoutsBasic />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormLayoutsIcon />
      </Grid>
      <Grid item xs={12}>
        <FormLayoutsAlignment />
      </Grid>
    </Grid>
  )
}

export default FormLayouts
