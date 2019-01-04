import React, { Component } from 'react'
import TableCommerces from './TableCommerces'
import Loading from './Loading'
import Error from './Error'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import Paper from '@material-ui/core/Paper'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import TableFooter from '@material-ui/core/TableFooter'
import TablePagination from '@material-ui/core/TablePagination'
export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      commerces: [],
      loading: false,
      error: false,
      currentPage: 0,
      currentRows: 10,
      currentSort: '',
      searchInput: '',
      currentFilter: '',
      numResults: 0,
      lastPage: 0
    }
  }

  componentDidMount() {
    this.fetchCommerces(10, 1, '', '', 0)
  }

  fetchCommerces = (rows, page, filter, sort, start) => {
    this.setState(
      {
        loading: true
      },
      () => {
        fetch(
          'https://data.ratp.fr/api/records/1.0/search/?dataset=liste-des-commerces-de-proximite-agrees-ratp&facet=tco_libelle&facet=ville&facet=code_postal' +
            filter +
            sort +
            '&rows=' +
            rows +
            '&start=' +
            start
        )
          .then(results => {
            return results.json()
          })
          .then(data => {
            const commerces = data.records.map(record => record.fields)
            this.setState({
              commerces: commerces,
              numResults: data.nhits,
              lastPage:
                Math.floor(data.nhits / rows) === 0
                  ? 0
                  : Math.floor(data.nhits / rows) - 1,
              loading: false,
              error: false
            })
          })
          .catch(err => {
            console.log('error => ', err)
            this.setState({
              error: true,
              loading: false,
              lastPage: 1,
              numResults: 0,
              commerces: []
            })
          })
        this.setState({
          currentPage: page,
          currentSort: sort,
          currentFilter: filter,
          currentRows: rows
        })
      }
    )
  }

  handlePrevious = () => {
    const newPage =
      this.state.currentPage === 0 ? 0 : this.state.currentPage - 1
    this.setPage(newPage)
  }

  handleFirst = () => {
    const newPage = 0
    this.setPage(newPage)
  }

  handleNext = () => {
    const newPage = this.state.currentPage + 1
    this.setPage(newPage)
  }

  setPage = page => {
    const start = page * this.state.currentRows
    this.fetchCommerces(
      this.state.currentRows,
      page,
      this.state.currentFilter,
      this.state.currentSort,
      start
    )
  }

  handleChangePage = (e, page) => {
    this.setPage(page)
  }

  handleLast = () => {
    const newPage = this.state.lastPage
    this.setPage(newPage)
  }

  handleSortCodePostal = () => {
    const newPage = 0
    const start = newPage * this.state.currentRows
    const newSort =
      this.state.currentSort === '&sort=code_postal'
        ? '&sort=-code_postal'
        : '&sort=code_postal'
    this.fetchCommerces(
      this.state.currentRows,
      newPage,
      this.state.currentFilter,
      newSort,
      start
    )
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleRows = e => {
    this.setState(
      {
        currentRows: e.target.value
      },
      () => {
        this.setPage(0)
      }
    )
  }

  handleSubmit = e => {
    e.preventDefault()
    const newPage = 0
    const start = newPage * this.state.currentRows
    const newSort = ''
    const newFilter =
      this.state.searchInput === ''
        ? ''
        : '&refine.tco_libelle=' + this.state.searchInput
    this.fetchCommerces(
      this.state.currentRows,
      newPage,
      newFilter,
      newSort,
      start
    )
  }

  handleReset = () => {
    this.fetchCommerces(10, 1, '', '', 0)
  }

  handleCloseLoading = () => {
    this.setState({ loading: false })
  }

  handleCloseError = () => {
    this.setState({ error: false })
  }

  render() {
    const TablePaginationActions = () => {
      return (
        <div className="paginationButtons">
          <IconButton
            disabled={this.state.currentPage === 0}
            aria-label="First Page"
            onClick={this.handleFirst}
            // className="paginationButton"
          >
            {'|<'}
          </IconButton>

          <IconButton
            disabled={this.state.currentPage === 0}
            aria-label="Previous Page"
            onClick={this.handlePrevious}
            // className="paginationButton"
          >
            {'<'}
          </IconButton>
          <IconButton
            disabled={this.state.currentPage === this.state.lastPage}
            aria-label="Next Page"
            onClick={this.handleNext}
            // className="paginationButton"
          >
            {'>'}
          </IconButton>
          <IconButton
            disabled={this.state.currentPage === this.state.lastPage}
            aria-label="Last Page"
            onClick={this.handleLast}
            // className="paginationButton"
          >
            {'>|'}
          </IconButton>
        </div>
      )
    }
    return (
      <div>
        <AppBar position="static" color="primary">
          <Toolbar>
            <div className="title" onClick={this.handleReset}>
              <Typography variant="h6" color="inherit">
                Trouvez votre commerce de proximité
              </Typography>
            </div>
            <div className="search">
              <form onSubmit={this.handleSubmit}>
                <div className="searchIcon" onClick={this.handleSortCodePostal}>
                  <SearchIcon />
                </div>
                <div className="searchInput">
                  <InputBase
                    type="search"
                    placeholder="    Nom du commerce ..."
                    id="searchInput"
                    onChange={this.handleChange}
                  />
                </div>
              </form>
            </div>
            <div>
              <Button color="inherit" onClick={this.handleSortCodePostal}>
                Tri par code postal
              </Button>
            </div>
          </Toolbar>
        </AppBar>

        {this.state.error ? <Error /> : null}
        {this.state.loading ? <Loading /> : null}

        <div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom du Commerce</TableCell>
                  <TableCell align="right">Ville</TableCell>
                  <TableCell align="right">Code Postal</TableCell>
                </TableRow>
              </TableHead>
              <TableCommerces commerces={this.state.commerces} />
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    colSpan={5}
                    count={this.state.numResults}
                    rowsPerPage={this.state.currentRows}
                    page={this.state.currentPage}
                    ActionsComponent={TablePaginationActions}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleRows}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </div>

        {console.log(this.state)}
      </div>
    )
  }
}
