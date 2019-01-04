import React from 'react'
import { Tabs, Tab, Paper } from '@material-ui/core'

export default props => (
  <Paper style={{ marginTop: '2%' }}>
    <Tabs
      value={props.tab}
      onChange={props.handleChangeTab}
      indicatorColor="primary"
      textColor="primary"
      centered
    >
      <Tab label="Commerces" />
      <Tab label="Geolocalisation" />
    </Tabs>
  </Paper>
)
