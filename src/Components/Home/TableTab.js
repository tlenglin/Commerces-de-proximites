import React, { Component } from 'react'
import {
  IconButton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  Typography
} from '@material-ui/core/'
import TableCommerces from './TableCommerces'

export default class TableTab extends Component {
  render() {
    const TablePaginationActions = () => {
      return (
        <div style={{ flexShrink: '0' }}>
          <IconButton
            disabled={this.props.currentPage === 0}
            aria-label="First Page"
            onClick={this.props.handleFirst}
          >
            {'|<'}
          </IconButton>
          <IconButton
            disabled={this.props.currentPage === 0}
            aria-label="Previous Page"
            onClick={this.props.handlePrevious}
          >
            {'<'}
          </IconButton>
          <IconButton
            disabled={this.props.currentPage === this.props.lastPage}
            aria-label="Next Page"
            onClick={this.props.handleNext}
          >
            {'>'}
          </IconButton>
          <IconButton
            disabled={this.props.currentPage === this.props.lastPage}
            aria-label="Last Page"
            onClick={this.props.handleLast}
          >
            {'>|'}
          </IconButton>
        </div>
      )
    }

    return (
      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#3087a8' }}>
                <Typography variant="button" style={{ color: 'white' }}>
                  Nom du Commerce
                </Typography>
              </TableCell>
              <TableCell style={{ backgroundColor: '#3087a8' }} align="right">
                <Typography style={{ color: 'white' }} variant="button">
                  Ville
                </Typography>
              </TableCell>
              <TableCell style={{ backgroundColor: '#3087a8' }} align="right">
                <Typography style={{ color: 'white' }} variant="button">
                  Code Postal
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableCommerces commerces={this.props.commerces} />
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                colSpan={5}
                count={this.props.numResults}
                rowsPerPage={this.props.currentRows}
                page={this.props.currentPage}
                ActionsComponent={TablePaginationActions}
                onChangePage={this.props.handleChangePage}
                onChangeRowsPerPage={this.props.handleRows}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
}
