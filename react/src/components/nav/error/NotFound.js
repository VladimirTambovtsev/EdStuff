import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Paper from '@material-ui/core/Paper'
import {Link} from 'react-router-dom'

class NotFound extends Component {
  render() {
    return (
      <div className='paperOut'>
        <Paper className='paperIn'>
          404. Страница не найдена.
          <br/>
          <br/>
          <Link to='/'>Перейти на главную</Link>
        </Paper>
      </div>
    )
  }
}

export default withRouter(NotFound)
