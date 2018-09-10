import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Paper from '@material-ui/core/Paper'
import {Link} from 'react-router-dom'

class NotAuth extends Component {
  render() {
    return (
      <div className='paperOut'>
        <Paper className='paperIn'>
          Вы не авторизованы. 
          <br/>
          <br/>
          <Link to='/login'>Войти в систему</Link>
        </Paper>
      </div>
    )
  }
}

export default withRouter(NotAuth)
