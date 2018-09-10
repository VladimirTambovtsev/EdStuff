import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo';
import Loading from '../nav/error/Loading'
import Courselist from './Courselist'


class CourselistContainer extends Component {
	render() {
		
		return (
        <Query query={USER_QUERY} >
          {({ loading, error, data }) => {
            if (loading) return <Loading />;
            if (error) return `Error!`;

            return (
              <div>
                <Courselist user={data} />
              </div>
            );
          }}
        </Query>
		)
	}
}

  const USER_QUERY = gql`
    query Me {
      me {
        id
      }
    }
  `

export default CourselistContainer