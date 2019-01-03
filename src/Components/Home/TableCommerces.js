import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'

const TableCommerces = ({ commerces }) => {
  return (
    <TableBody>
      {commerces.map((commerce, index) => (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            {commerce.tco_libelle}
          </TableCell>
          <TableCell align="right">{commerce.ville}</TableCell>
          <TableCell align="right">{commerce.code_postal}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export default TableCommerces
