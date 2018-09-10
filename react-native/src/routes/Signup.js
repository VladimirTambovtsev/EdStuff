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

class Signup extends Component {
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

	// submit = async () => {
	// 	if (this.state.isSubmitting) {	// remove multiple response
	// 		return;
	// 	}

	// 	let response;
	// 	this.setState({ isSubmitting: true });
	// 	try {
	// 		response = await this.props.mutate({
	// 			variables: this.state.values
	// 		});
	// 	} catch(err) {
	// 		console.log(err);
	// 	}
	// 	console.log(response);
	// 	this.setState({ isSubmitting: false });
	// };

	submit = async () => {
		console.log('1');
		const { name, email, password, nameFile } = this.state.values;
		await this.props.signupMutation({
	        variables: {
	          name,
	          email,
	          password,
	          nameFile,
	        },
	    })
	    .then((result) => {
	        const { token, user } = result.data.signup
	        this._saveUserData(token, user);
	        console.log("Success");
      	})
      	.catch((e) => {
	        if(e) {
	          console.log(e);
	        } else {
	          console.log('error: No connection with server')
	        }
	    })
	}

	_saveUserData = async (token, user) => {
	    await AsyncStorage.setItem(AUTH_TOKEN, token);
	    this.setState(defaultState);
	    this.props.history.push('/courses');
	}

	goToLoginPage = () => {
		this.props.history.push('/login');
	};

	validateEmail(email) {
		return validator.validate(email)
	}


	render() {
		const { values: { email, password, name, surname, phone } } = this.state;
		return(
			<ImageBackground source={require('../../assets/landing.jpg')} style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				<View style={styles.fieldContainer}>
					{/*
					<TextInput
						onChangeText={text => this.onChangeText('email', text)}
						value={email}
						style={styles.field}
						placeholder="Email"
					/>
					<TextInput
						onChangeText={text => this.onChangeText('password', text)}
						 value={password}
						 style={styles.field}
						 placeholder="Пароль"
						 secureTextEntry
						/>
					<TextInput
						onChangeText={text => this.onChangeText('name', text)}
						value={name}
						style={styles.field}
						placeholder="Имя"
					/>
					<TextInput
						onChangeText={text => this.onChangeText('surname', text)}
						value={surname}
						style={styles.field}
						placeholder="Фамилия"
					/>
					<TextInput
						onChangeText={text => this.onChangeText('phone', text)}
						 value={phone}
						 style={styles.field}
						 placeholder="Телефон"
					/>
					<TextInput  style={styles.field} placeholder="Школа | ВУЗ | Компания (список)" />
				*/}

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

					<Input
					  placeholder='Имя'
					  leftIcon={
					    <Icon
					      name='user'
					      size={24}
					      color='white'
					    />
					  }
					  placeholderTextColor="#fff"
					  inputContainerStyle={styles.field2}
					  inputStyle={{ color: "#fff" }}
					/>
					<Input
					  placeholder='Фамилия'
					  leftIcon={
					    <Icon
					      name='user'
					      size={24}
					      color='white'
					    />
					  }
					  placeholderTextColor="#fff"
					  inputContainerStyle={styles.field2}
					  inputStyle={{ color: "#fff" }}
					  errorStyle={{ color: 'red' }}
					/>
					<Input
					  placeholder='Телефон'
					  leftIcon={
					    <Icon
					      name='phone'
					      size={24}
					      color='white'
					    />
					  }
					  placeholderTextColor="#fff"
					  inputContainerStyle={styles.field2}
					  inputStyle={{ color: "#fff" }}
					  keyboardType={'phone-pad'}
					/>
				</View>
					<View style={styles.button}>
						<Button title="Регистрация" onPress={this.submit} color="#fff" />
					</View>
					<Text style={{ textAlign: 'center', color: '#fff', margin: 10 }}>или</Text>
          			<Button title="Войти" onPress={this.goToLoginPage} color="#fff" />
				</View>
			</ImageBackground>
		);
	}
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!, $nameFile: String!) {
    signup(email: $email, password: $password, name: $name, nameFile:$nameFile) {
      token
      user {
        name
        id
      }
    }
  }
`

// const signUpMutation = gql`
// mutation($email:String!, $password:String!, $name:String!, $surname:String!, $phone:String!, $school:String, $college:String, $company:String) {
// 	signup(email:$email, password:$password, name:$name, surname:$surname, phone:$phone, school:$school, college:$college, company:$company) {
//     	token
//     }
// }
// `;


export default compose(
  withApollo,
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
)(Signup)

