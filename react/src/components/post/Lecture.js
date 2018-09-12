import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'

import '../../index.css'
import Button from '@material-ui/core/Button'
import NotFound from '../nav/error/NotFound'
import Loading from '../nav/error/Loading'
import ImageTemplate from '../nav/ImageTemplate'


	/* 
	TODO:
	1. sort img and descr by Date
	2. make navigation between chapters
	*/

class Lecture extends Component {

	state = {
		currentDescription: 0
	}


	nextDescription(currentDescription, descriptionLength) {
		if (currentDescription === descriptionLength - 1) {
			this.props.history.replace('/')
		} else { 
			this.setState({ currentDescription: ++currentDescription })
		}
	}

	render() {

		if (this.props.postChapter.error) {
	      return (
	        <NotFound/>
	      )
	    }

	    if (this.props.postChapter.loading) {
	      return (<Loading />)
	    }

	    const { name, description, files } = this.props.postChapter.chapter
	    const { currentDescription } = this.state;
	    const descriptionLength = description.length;
		return (
			<ul>
				<strong>Chapter: { name }</strong>
				<br/><br/>
				{ description.map((descr, index) => (
						<li className={index === currentDescription ? 'titleActive' : ''} key={descr.id}>{descr.title}

						</li>
					)
				)}
				{ console.log(new Date(description[1].createdAt) - new Date(description[0].createdAt)) }

				{ files.map(file => <ImageTemplate key={file.id} nameFile={file.src} />) }

				<br/><br/>
				<p>{ description[currentDescription].text }</p>

				<Button onClick={() => this.nextDescription(currentDescription, descriptionLength)}>Next</Button>
			</ul>
		)
	}
}

const CHAPTER_QUERY = gql`
	query chapter($id:ID!) {
	  chapter(id:$id) {
	    id
	    name
	    createdAt
	    files {
	    	id
	    	title
	    	src
	    	createdAt
	    }
	    description {
	      id
	      title
	      text
	      createdAt
	    }
	  }
	}
`

export default compose(
  graphql(CHAPTER_QUERY, {
    name: 'postChapter',
    options: props => ({
      variables: {
        id: props.match.params.lectureId,
      },
    }),    
  }),
  withRouter
)(Lecture)
 

