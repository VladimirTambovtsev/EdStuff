import React, { Component } from 'react';
import { AsyncStorage, Button, Text, View, TextInput, StyleSheet, ImageBackground } from 'react-native';
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Card } from 'react-native-elements';

import { AUTH_TOKEN } from '../constants/constants';

var validator = require('email-validator')


const styles = StyleSheet.create({
	fieldContainer: {
		width: 250,
	},
	field: {
		borderBottomWidth: 1,
		borderRadius: 4,
	    borderColor: '#d6d7da',
		fontSize: 19,
		margin: 10,
		height: 40,
		backgroundColor: 'rgba(255, 255, 255, .8)',
		color: '#d6d7da',
		padding: 8,
		paddingLeft: 10,
	},
	field2: {
		margin: 10,
	},
	button: {
		borderWidth: 1,
		borderColor: '#fff',
		marginTop: 30,
	}
});

export default class Signup extends Component {
	state = {
		values: {
			email: '',
			password: '',
			name: '',
			surname: '',
			phone: '',
			nameFile: ''
		},
		errors: {},
		isSubmitting: false
	};

	onChangeText = (key, value) => {
		this.setState(state => ({
			values: {
			...state.values,
			[key]: value,
			},
		}));
	};


	  submit = async () => {
	    console.log('1');
	  }


	goToSignupPage = () => {
		this.props.history.push('/');
	};

	render() {
		const { values: { email, password, name, surname, phone } } = this.state;
		return(
			<ImageBackground source={require('../../assets/landing.jpg')} style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				<View style={styles.fieldContainer}>
					<View style={{ backgroundColor: 'rgba(255, 255, 255, .5)', paddingBottom: 10 }}>
						<Input
						  placeholder='Email'
						  leftIcon={
						  	<Icon 
						  		name='envelope'
						  		size={22}
						  		color="white"
						  	/>
						  }
						  placeholderTextColor="#fff"
						  inputContainerStyle={styles.field2}
						  inputStyle={{ color: "#fff" }}
						  autoCapitalize="none"
						  inputRef={node => this.input0 = node}
						/>

						<Input
						  placeholder='Пароль'
						  leftIcon={
						    <Icon
						      name='unlock-alt'
						      size={24}
						      color='white'
						    />
						  }
						  placeholderTextColor="#fff"
						  inputContainerStyle={styles.field2}
						  inputStyle={{ color: "#fff" }}
						  secureTextEntry
						/>

					</View>
				<View style={styles.button}>
					<Button title="Войти" onPress={this.submit} color="#fff" />
				</View>
				<Text style={{ textAlign: 'center', color: '#fff', margin: 10 }}>или</Text>
      			<Button title="Регистрация" onPress={this.goToSignupPage} color="#fff" />
				</View>
			</ImageBackground>
		);
	}
}



const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        name
        id
      }
    }
  }
`

// export default compose(
//   withApollo,
//   graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
// )(Login)



