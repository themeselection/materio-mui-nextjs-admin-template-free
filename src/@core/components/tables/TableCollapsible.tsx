// ** React Imports
import { useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
// Remove the duplicate import statement for 'Box'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'

const TableCollapsible = (props: { data: any; header: any }) => {
  const { data, header } = props

  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            {header.map((item: string) => (
              <TableCell key={item}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row: any) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Row = (props: { row: any }) => {
  // ** Props
  const { row } = props

  // ** State
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        {row.map((rowItem: any) => (
          <TableCell key={rowItem}>{rowItem}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ m: 2 }}></Box>
            <Typography variant='h6' gutterBottom component='div'>
              History
            </Typography>
            <Table size='small' aria-label='purchases'>
              {row.rowItemHeader.map((rowItemHeader: any) => (
                <TableRow>
                  {row.map((rowItem: any) => (
                    <TableCell key={rowItem.id}>{rowItem}</TableCell>
                  ))}
                </TableRow>
              ))}
              <TableBody>
                {row.item.map(
                  (
                    rowItem: any // Fix: Added parentheses around the arrow function parameter
                  ) => (
                    <TableRow key={row.id}>
                      {row.rowItemHeader.map((rowItemHeader: any) => (
                        <TableRow>
                          {row.item.map((rowItem: any) => (
                            <TableCell key={rowItem.id}>{rowItem}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default TableCollapsible
