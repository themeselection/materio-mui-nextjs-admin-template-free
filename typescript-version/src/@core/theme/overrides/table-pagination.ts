// MUI Imports
import type { Theme } from '@mui/material/styles'

const tablePagination: Theme['components'] = {
  MuiTablePagination: {
    styleOverrides: {
      toolbar: ({ theme }) => ({
        paddingInlineEnd: `${theme.spacing(3)} !important`
      })
    }
  }
}

export default tablePagination
