import React, {Component} from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import List from '@material-ui/core/List'
import Icon from '@material-ui/core/Icon'
import Divider from '@material-ui/core/Divider'
import {AUTH_TOKEN} from '../../../constants/constants'

class ListSideBar extends Component {
  state = {
    isSideBarOpen: false
  }

  toggleDrawer = (isSideBarOpen) => () => {
    this.setState({isSideBarOpen: isSideBarOpen})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({isSideBarOpen: nextProps.isSideBarOpen})
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div>
      <List>
        <div className="menuItem">
          {
            this.props.isMobile && (<MenuItem>
              <ListItemIcon>
                <Icon>arrow_back</Icon>
              </ListItemIcon>
            </MenuItem>)
          }

          <Link to='/' className='link'>
            <MenuItem>
              <ListItemIcon>
                <Icon>view_quilt</Icon>
              </ListItemIcon>
              <ListItemText primary='Курсы'/>
            </MenuItem>
          </Link>
          <Link to='/drafts' className='link'>
            <MenuItem>
              <ListItemIcon>
                <Icon>mode_edit</Icon>
              </ListItemIcon>
              <ListItemText primary='Создать курс'/>
            </MenuItem>
          </Link>
          <Link to='/cars' className='link'>
            <MenuItem>
              <ListItemIcon>
                <Icon>style</Icon>
              </ListItemIcon>
              <ListItemText primary='Теги'/>
            </MenuItem>
          </Link>
          <Link to='/chats' className='link'>
            <MenuItem>
              <ListItemIcon>
                <Icon>chat</Icon>
              </ListItemIcon>
              <ListItemText primary='Чат'/>
            </MenuItem>
          </Link>
          <Divider />
          <Link to='/courses/my' className='link'>
            <MenuItem>
              <ListItemIcon>
                <Icon>view_quilt</Icon>
              </ListItemIcon>
              <ListItemText primary='Мои курсы'/>
            </MenuItem>
          </Link>
          <Divider />
          {
          // <Link to='/api' className='link'>
          //   <MenuItem>
          //     <ListItemIcon>
          //       <Icon>cloud_queue</Icon>
          //     </ListItemIcon>
          //     <ListItemText primary='API'/>
          //   </MenuItem>
          // </Link>
          }
          <Link to='/users' className='link'>
            <MenuItem>
              <ListItemIcon>
                <Icon>group</Icon>
              </ListItemIcon>
              <ListItemText primary='Пользователи'/>
            </MenuItem>
          </Link>

          {
            !authToken && (<Link to='/login' className='link'>
              <MenuItem>
                <ListItemIcon>
                  <Icon>account_circle</Icon>
                </ListItemIcon>
                <ListItemText primary='Войти'/>
              </MenuItem>
            </Link>)
          }

        </div>
      </List>
    </div>)
  }
}

export default withRouter(ListSideBar)
