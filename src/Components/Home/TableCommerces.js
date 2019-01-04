import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'

const TableCommerces = ({ commerces }) => {
  return (
    <TableBody>
      {commerces.map((commerce, index) => (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            <Typography variant="body1" color="textSecondary">
              {commerce.tco_libelle}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="body1" color="textSecondary">
              {commerce.ville}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Typography variant="body1" color="textSecondary">
              {commerce.code_postal}
            </Typography>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export default TableCommerces
