import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import NotFound from '../nav/error/NotFound'
import Loading from '../nav/error/Loading'
import ImageTemplate from '../nav/ImageTemplate'


class Lecture extends Component {
	render() {

		/* 
		TODO:
		1. make query for chapters (sort by CreatedAt? )
		2. render chapters
		3. make navigation between chapters

		*/
		if (this.props.postQuery.error) {
	      return (
	        <NotFound/>
	      )
	    }

	    if (this.props.postQuery.loading) {
	      return (<Loading />)
	    }

	    /* Refactor by chapters */
	    console.log(this.props.postQuery.post.chapters)
	    const { chapters } = this.props.postQuery.post
		return (
			<ul>
				Lecture:
					Descr 
					Imgs
					{chapters.map(chapter => (
						<li key={chapter.id}>Chapter Title: {chapter.name}
							{chapter.description} <br/>
							<ImageTemplate nameFile={chapter.files} />
						</li>
					))}
			</ul>
		)
	}
}

const CHAPTERS_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title      
      nameFile
      author {
        id
        name
      }
      chapters{
        id
        name
        description
        files
        createdAt
      }
    }
  }
`


export default
  graphql(CHAPTERS_QUERY, {
    name: 'postQuery',
    options: props => ({
      variables: {
        id: props.match.params.id,
      },
    }),
  })(Lecture)

