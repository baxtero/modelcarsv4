import { createStore, bindActionCreators } from "redux";
import { Provider, connect } from "react-redux";
import {render} from "react-dom";
import { v4 as uuidv4 } from 'uuid';
import React from "react";

// Dummy data for app
const attendeeList = [{
	name: 'Charlie Kelly',
	color: '#E74C3C',
	id: uuidv4()
}, {
	name: 'Mac',
	color: '#553285',
	id: uuidv4()
}, {
	name: 'Frank Reynolds',
	color: '#296AA8',
	id: uuidv4()
}, {
	name: 'Deandra Reynolds',
	color: '#202020',
	id: uuidv4()
}, {
	name: 'Dennis Reynolds',
	color: '#287572',
	id: uuidv4()
}, ];


/* --- COMPONENTS --- */
class Store extends React.Component {
	render() {
		return (
			<div>
				<h1>Attendees</h1>
				<hr/>
				<AddAttendee addAttendee={this.props.addAttendee} />
				<hr/>
				<Attendees attendees={this.props.attendees} removeAttendee={this.props.removeAttendee}  />
			</div>
		)
	}
}

class Attendees extends React.Component {

	render() {
		return (
			<ul className="attendees">
				{this.props.attendees.map((attendee, index) =>
					<li className="attendees__attendee" key={index}>
						<Badge attendee={attendee} />																						<RemoveAttendee removeAttendee={this.props.removeAttendee} index={index} />
					</li>
				)}
			</ul>
		)
	}
}

class AddAttendee extends React.Component {
	handleSubmit(e) {
		// Stop page refreshing
		e.preventDefault();

		let refs = this.refs;
		let name = refs.name.value;
		let color = refs.color.value

		// Trigger action
		this.props.addAttendee(name, color);

		// Reset form
		refs.addAttendee.reset();
	}
	render() {
		return (
			<div className="row">
				<div className="medium-6 medium-offset-3 columns">
					<form ref="addAttendee" onSubmit={this.handleSubmit.bind(this)}>
						<label for="name">Name</label>
						<input id="name" type="text" ref="name" placeholder="John Doe" />
						<label for="color">Favourite color</label>
						<input id="color" type="text" ref="color" placeholder="#2e2e2e" />
						<button type="submit" className="button">Add attendee</button>
					</form>
				</div>
			</div>
		)
	}
}

class RemoveAttendee extends React.Component {
	handleOnClick() {
		let index = this.props.index;

		this.props.removeAttendee(index);
	}
	render() {
		return (

			<button className="alert button tiny" onClick={this.handleOnClick.bind(this)}> &times; Remove attendee</button>
		)
	}
}

class Badge extends React.Component {

	render() {
		var style = {backgroundColor: this.props.attendee.color};
										 
		return (			
			<div className="hello-badge" style={style}>
				<p className="hello-badge__title"><span className="hello-badge__hello">Hello</span><br /> my name is</p>
				<p className="hello-badge__name">{this.props.attendee.name}</p>
			</div>
		)
	}
}


/* --- REDUCERS --- */
function reducer(state = [], action) {
	switch (action.type) {
		case 'ADD_ATTENDEE':
			// Return a new array with old state and added attendee.
			return [{
					name: action.name,
					color: action.color
				},
				...state
			];
		case 'REMOVE_ATTENDEE':
			return [
				// Grab state from begging to index of one to delete
				...state.slice(0, action.index),
				// Grab state from the one after one we want to delete
				...state.slice(action.index + 1)
			];
		default:
			return state;
	}
};

/* --- ACTIONS --- */

const actions = {
	addAttendee: (name, color) => {
		return {
			type: 'ADD_ATTENDEE',
			id: uuidv4(),
			name,
			color
		}
	},
	removeAttendee: (index) => {
		return {
			type: 'REMOVE_ATTENDEE',
			index
		}
	}
};


/* --- STORE --- */

const AppContainer = connect(
	function mapStateToProps(state) {
		return {
			attendees: state
		};
	},
	function mapDispatchToProps(dispatch) {
		return bindActionCreators(actions, dispatch);
	}
)(Store);

const store = createStore(reducer, attendeeList);

/* --- OTHER --- */

// Render the app
render(
	<Provider store={store}>
    <AppContainer />
  </Provider>,
	document.getElementById('root')
);