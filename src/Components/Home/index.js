import React, { Component } from 'react'
import Loading from './Loading'
import Error from './Error'
import HeaderTable from './HeaderTable'
import Footer from './Footer'
import TableTab from './TableTab'

import { Grid } from '@material-ui/core'

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
      lastPage: 0,
      tab: 0
    }
  }

  componentDidMount() {
    this.fetchCommerces(10, 0, '', '', 0)
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
              lastPage: 0,
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

  handleChangeTab = (e, value) => {
    this.setState({
      tab: value
    })
  }

  handleRows = e => {
    this.setState({ currentRows: e.target.value }, () => {
      this.setPage(0)
    })
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
    this.fetchCommerces(10, 0, '', '', 0)
  }

  handleCloseLoading = () => {
    this.setState({ loading: false })
  }

  handleCloseError = () => {
    this.setState({ error: false })
  }

  render() {
    return (
      <div
        style={{ backgroundColor: 'lightgray', width: '100%', height: '100%' }}
      >
        {this.state.tab === 0 ? (
          <HeaderTable
            handleChange={this.handleChange}
            handleReset={this.handleReset}
            handleSubmit={this.handleSubmit}
            handleSortCodePostal={this.handleSortCodePostal}
            tab={this.state.tab}
          />
        ) : (
          <div>HEADER TAB2</div>
        )}

        {this.state.error ? <Error /> : null}
        {this.state.loading ? <Loading /> : null}

        <Grid container justify="center">
          <Grid item sm>
            {this.state.tab === 0 ? (
              <TableTab
                currentPage={this.state.currentPage}
                currentFilter={this.state.currentFilter}
                currentSort={this.state.currentSort}
                currentRows={this.state.currentRows}
                lastPage={this.state.lastPage}
                commerces={this.state.commerces}
                numResults={this.state.numResults}
                handleFirst={this.handleFirst}
                handleLast={this.handleLast}
                handlePrevious={this.handlePrevious}
                handleNext={this.handleNext}
                handleChangePage={this.handleChangePage}
                handleRows={this.handleRows}
              />
            ) : (
              <div>TAB2</div>
            )}
          </Grid>
        </Grid>
        {/* <div style={{ marginTop: '2%', marginLeft: '5%', marginRight: '5%' }}>
          {this.state.tab === 0 ? (
            <TableTab
              currentPage={this.state.currentPage}
              currentFilter={this.state.currentFilter}
              currentSort={this.state.currentSort}
              currentRows={this.state.currentRows}
              lastPage={this.state.lastPage}
              commerces={this.state.commerces}
              numResults={this.state.numResults}
              handleFirst={this.handleFirst}
              handleLast={this.handleLast}
              handlePrevious={this.handlePrevious}
              handleNext={this.handleNext}
              handleChangePage={this.handleChangePage}
              handleRows={this.handleRows}
            />
          ) : (
            <div>TAB2</div>
          )}
        </div> */}
        <Footer tab={this.state.tab} handleChangeTab={this.handleChangeTab} />
        {/* {console.log(this.state)} */}
      </div>
    )
  }
}
