import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import Paper from '@material-ui/core/Paper'
import Post from './Post'
import Loading from '../nav/error/Loading'

class Courselist extends React.Component {
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if (this.props.location.key !== nextProps.location.key) {
  //     this.props.courselist.refetch()
  //   }
  // }

  render() {
    const userId = this.props.user.me.id

    return (
      <React.Fragment>
        <div className='paperOut'>
          <Paper className='paperIn'>
          <h1>Мои Курсы</h1>
          
          <Query query={COURSELIST_QUERY} variables={{ userId }} >
            {({ loading, error, data }) => {
              if (loading) return <Loading />;
              if (error) { console.log(error); return `Error!`; }

              return (
                <ul>
                {/* Must be refactored */}
                  {
                    data.courselist.map(courselist => (
                      courselist.courseId.map(course => (
                          <Post
                            key={course.id}
                            post={course}
                            refresh={() => this.props.courselist.refetch()}
                          />
                        )
                      )
                    )
                  )
                  }
                </ul>
              );
            }}
          </Query>
        </Paper>
        </div>
      </React.Fragment>
    )
  }
}

const COURSELIST_QUERY = gql`
  query coureslist($userId:ID!){
    courselist(userId:$userId) {
      id
      courseId{
        id
        title
        text
        isPublished
        nameFile
        cars {
          id
          name
        }
      }
    }
  }
`

export default Courselist
