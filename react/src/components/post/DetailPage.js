import React from 'react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import ImageTemplate from '../nav/ImageTemplate'
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';

import NotFound from '../nav/error/NotFound'
import Loading from '../nav/error/Loading'
import UploadFile from '../nav/UploadFile'



class DetailPage extends React.Component {
  state = {
    name: '', // name of the chapter 
    description: '',
    nameFile: ''
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  render() {
    if (this.props.postQuery.error) {
      return (
        <NotFound/>
      )
    }

    if (this.props.postQuery.loading) {
      return (<Loading />)
    }

    const { post } = this.props.postQuery
    let action = this._renderAction(post)
    
    return (
      <React.Fragment>
        <div className='paperOut'>
          <Paper className='paperIn'>
            <h1 className='f3 black-80 fw4 lh-solid'>
              {post.title} by <Link to={'/user/' + post.author.id} title='Feed'>
                {post.author.name}
              </Link>
            </h1>
            <p className='black-80 fw3'>{post.text}</p>
            {post.cars.map(car => (

              <Link to={'/car/' + car.id} title='Car' key={car.id}>
                {car.name}
                <br/>
              </Link>
            ))}
            <ImageTemplate
              nameFile={post.nameFile}
            />
            {/*<Button variant="contained">Приступить</Button>*/}
            {action}

            {post.chapters.map((chapter, index) => (
              <Link to={this.props.history.location.pathname + "/lecture/" + chapter.id} key={chapter.id} >
                <Paper className="paperIn mt2">
                  <h3>{++index} - {chapter.name}</h3>  <br/>
                  {chapter.createdAt} <br/>
                </Paper>
              </Link>
            ))}

          </Paper>
        </div>
      </React.Fragment>
    )
  }

  _renderAction = ({ id, isPublished, author }) => {
    if (!isPublished) {
      return (
        <React.Fragment>
          <TextField
            id="name"
            label="Тема раздела"
            value={this.state.name}
            onChange={this.handleChange('name')}
            margin="normal"
          />
          <br/>
          <TextField
            id="description"
            label="Описание"
            multiline
            rowsMax="4"
            value={this.state.description}
            onChange={this.handleChange('description')}
            margin="normal"
          />
          <br/>
          <UploadFile
            isEditMode={true}
            onSelectFile={(nameFile) => {this.setState({nameFile: nameFile})}} />

          
          <Button onClick={() => this.createChapter(id, this.state.name, this.state.description, this.state.nameFile)} variant='raised' color='primary'>
          + Добавить раздел
          </Button>
          <a
            className='f6 dim br1 ba ph3 pv2 mb2 dib black pointer'
            onClick={() => this.publishDraft(id)}
          >
            Опубликовать
          </a>{' '}
          <a
            className='f6 dim br1 ba ph3 pv2 mb2 dib black pointer'
            onClick={() => this.deletePost(id)}
          >
            Delete
          </a>
        </React.Fragment>
      )
    }
    return (
      <div>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => this.createCourselist(id, author.id)} 
        >
          Начать
        </Button>
        
        {/* Activate when courses will be paid
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => this.addToWishlist(id, author.id)} 
          >
          В список желаемого
        </Button>
        */}

      </div>
    )
  }

  deletePost = async id => {
    await this.props.deletePost({
      variables: { id },
    })
    this.props.history.replace('/')
  }

  publishDraft = async id => {
    await this.props.publishDraft({
      variables: { id },
    })
    this.props.history.replace('/')
  }

  createChapter = async (courseBy, name, description, files) => {
    const id = courseBy;
    await this.props.createChapter({
      variables: { courseBy, name, description, files },
      refetchQueries: [{ 
        query: POST_QUERY,
        variables: { id }
      }]
    })
    this.setState({
      name: '',
      description: '',
      nameFile: ''
    })
  }

  createCourselist = async (courseId, userId) => {
    await this.props.createCourselist({
      variables: { courseId, userId },
    })
    this.props.history.replace('/courses/my')
  }

  /* Activate when courses will be paid */
  /*  
  addToWishlist = async (courseId, userId) => {
    await this.props.createWishlist({
      variables: { courseId, userId },
    })
    this.props.history.replace('/')
  }
  */

}

const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title
      text
      isPublished
      nameFile
      cars {
        id
        name
      }
      author {
        id
        name
      }
      chapters{
        id
        name
        createdAt
      }
    }
  }
`

const PUBLISH_MUTATION = gql`
  mutation publish($id: ID!) {
    publish(id: $id) {
      id
      isPublished
    }
  }
`

const CREATE_CHAPTER_MUTATION = gql`
  mutation createChapter($courseBy: ID!, $name:String!, $description:String, $files:String) {
   createChapter(courseBy:$courseBy,name:$name, description:$description, files:$files) {
    id
    name
    description
    files
  }
}
`;


const ADD_TO_MYCOURSES = gql`
  mutation createCourselist($userId:ID!, $courseId:ID!){
    createCourselist(userId:$userId, courseId:$courseId){
      courseId{
        id
        title
        text
      }
      userId{
        id
        name
      }
      createdAt
    }
  }
`

const DELETE_MUTATION = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`

/*
const ADD_TO_WISHLIST_MUTATION = gql`
  mutation createWishlist($courseId:ID!, $userId:ID!) {
    createWishlist(courseId:$courseId, userId:$userId){
      courseId {
        id
        title
      }
      userId {
        id
        name
      }
    }
  }
`
*/



export default compose(
  graphql(POST_QUERY, {
    name: 'postQuery',
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  }),
  graphql(PUBLISH_MUTATION, {
    name: 'publishDraft',
  }),
  graphql(CREATE_CHAPTER_MUTATION, {
    name: 'createChapter'
  }),
  graphql(ADD_TO_MYCOURSES, {
    name: 'createCourselist'
  }),
  graphql(DELETE_MUTATION, {
    name: 'deletePost',
  }),
  // graphql(ADD_TO_WISHLIST_MUTATION, {
  //   name: 'createWishlist',
  // }),
  withRouter,
)(DetailPage)
