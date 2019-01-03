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
export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      commerces: [],
      loading: false,
      error: false,
      currentPage: 1,
      currentRows: 10,
      currentSort: '',
      searchInput: '',
      currentFilter: '',
      numResults: 0,
      lastPage: 1
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
                  ? 1
                  : Math.floor(data.nhits / rows),
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
      this.state.currentPage === 1 ? 1 : this.state.currentPage - 1
    const start = (newPage - 1) * this.state.currentRows
    this.fetchCommerces(
      this.state.currentRows,
      newPage,
      this.state.currentFilter,
      this.state.currentSort,
      start
    )
  }

  handleFirst = () => {
    const newPage = 1
    const start = (newPage - 1) * this.state.currentRows
    this.fetchCommerces(
      this.state.currentRows,
      newPage,
      this.state.currentFilter,
      this.state.currentSort,
      start
    )
  }

  handleNext = () => {
    const newPage = this.state.currentPage + 1
    const start = (newPage - 1) * this.state.currentRows
    this.fetchCommerces(
      this.state.currentRows,
      newPage,
      this.state.currentFilter,
      this.state.currentSort,
      start
    )
  }

  handleLast = () => {
    const newPage = this.state.lastPage
    const start = (newPage - 1) * this.state.currentRows
    this.fetchCommerces(
      this.state.currentRows,
      newPage,
      this.state.currentFilter,
      this.state.currentSort,
      start
    )
  }

  handleSortCodePostal = () => {
    const newPage = 1
    const start = (newPage - 1) * this.state.currentRows
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

  handleSubmit = e => {
    e.preventDefault()
    const newPage = 1
    const start = (newPage - 1) * this.state.currentRows
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
            </Table>
          </Paper>
        </div>
        {this.state.currentPage - 1 === 0 ? null : (
          <button onClick={this.handleFirst}>{'<<'}</button>
        )}
        {this.state.currentPage - 1 === 0 ? null : (
          <button onClick={this.handlePrevious}>
            {this.state.currentPage - 1}
          </button>
        )}
        <button disabled={true}>{this.state.currentPage}</button>
        {this.state.currentPage === this.state.lastPage ? null : (
          <button onClick={this.handleNext}>
            {this.state.currentPage + 1}
          </button>
        )}
        {this.state.currentPage === this.state.lastPage ? null : (
          <button onClick={this.handleLast}>{'>>'}</button>
        )}
        {console.log(this.state)}
      </div>
    )
  }
}
