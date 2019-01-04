import React from 'react'
import { AppBar, Toolbar, Input, Button, Grid } from '@material-ui/core/'

import SearchIcon from '@material-ui/icons/Search'

export default props => (
  <AppBar
    position="static"
    style={{
      backgroundColor: '#132584',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px'
    }}
  >
    <Toolbar>
      <Grid container>
        <Grid item sm>
          <Button color="inherit" onClick={props.handleReset}>
            Trouvez votre commerce de proximité
          </Button>
        </Grid>
        <Grid item sm>
          <Input
            style={{
              float: 'left',
              backgroundColor: '#fff'
            }}
            type="search"
            placeholder="Nom du commerce ..."
            id="searchInput"
            onChange={props.handleChange}
          />
          <SearchIcon
            style={{ float: 'left', marginLeft: '10px' }}
            onClick={props.handleSubmit}
          />
        </Grid>
      </Grid>
      <Grid item sm>
        <Button color="inherit" onClick={props.handleSortCodePostal}>
          Tri par code postal
        </Button>
      </Grid>
    </Toolbar>
  </AppBar>
)
