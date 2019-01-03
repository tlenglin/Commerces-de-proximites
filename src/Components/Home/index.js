import React, { Component } from 'react'
import TableCommerces from './TableCommerces'

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
    console.log('componentDidMount')
    fetch(
      'https://data.ratp.fr/api/records/1.0/search/?dataset=liste-des-commerces-de-proximite-agrees-ratp' +
        this.state.currentSort +
        '&rows=' +
        this.state.currentRows
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
            Math.floor(data.nhits / this.state.currentRows) === 0
              ? 1
              : Math.floor(data.nhits / this.state.currentRows),
          loading: false,
          error: false
        })
      })
      .catch(err => {
        console.log('err => ', err)
      })
  }

  fetchCommerces = (rows, page, filter, sort, start) => {
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
        console.log('err => ', err)
      })
    this.setState({
      currentPage: page,
      currentSort: sort,
      currentFilter: filter,
      currentRows: rows
    })
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

  render() {
    return (
      <div>
        <div>
          <button onClick={this.handleSortCodePostal}>Code Postal</button>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Libellé</label>
            <textarea id="searchInput" onChange={this.handleChange} />
          </div>
          <div>
            <button>Rechercher</button>
          </div>
        </form>
        <TableCommerces commerces={this.state.commerces} />
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
