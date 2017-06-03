var React = require('react');
var PropTypes = require('prop-types');
var Link = require('react-router-dom').Link;

function PlayerPreview (props) {
  return (
    <div>
      <div className='column'>
        <img
          className='avatar'
          src={props.avatar}
          alt={'Avatar for ' + props.username}
        />
        <h2 className='username'>
          {props.username}
        </h2>
        <button
          className='reset'
          onClick={props.onReset.bind(null, props.id)}>
          Reset
        </button>
      </div>
    </div>
  )
}

PlayerPreview.PropTypes = {
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired
}

class PlayerInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: ''
    };
    // make sure the function always binds to this specific component
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    var value = event.target.value;

    this.setState(function () {
      return {
        username: value
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();


    this.props.onSubmit(
      this.props.id,
      this.state.username
    )
  }
  // renders the form
  render() {
    return (
      <form className='column' onSubmit={this.handleSubmit}>
        <label className='header' htmlFor='username'>
          {this.props.label}
        </label>
        <input
          id='username'
          placeholder='github username'
          type='text'
          autoComplete='off'
          value={this.state.username}
          onChange={this.handleChange}
        />
        <button
          className='button'
          type='submit'
          disabled={!this.state.username}>
            Submit
          </button>
      </form>
    )
  }
}

PlayerInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

// defines battle component
class Battle extends React.Component {
  // define state so you can get props from method
  constructor(props) {
    super(props);

    this.state = {
      playerOneName: '',
      PlayerTwoName: '',
      playerOneImage: null,
      playerTwoImage: null
    }
    // make sure the function always binds to this specific component
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(id, username) {
    this.setState(function() {
      var newState = {};
      newState[id + 'Name'] = username;
      newState[id + 'Image'] = 'https://github.com/' + username + '.png?size=200';
      return newState;
    })
  }
  // handles reset for avatars
  handleReset(id) {
    this.setState(function () {
      var newState = {};
      newState[id + 'Name'] = '';
      newState[id + 'Image'] = null;
      return newState
    })
  }
  render() {
    var playerOneName = this.state.playerOneName;
    var playerTwoName = this.state.playerTwoName;
    var playerOneImage = this.state.playerOneImage;
    var playerTwoImage = this.state.playerTwoImage;
    return (
      <div>
        <div className='row'>
          {!playerOneName && <PlayerInput
            id='playerOne'
            label='Player One'
            onSubmit={this.handleSubmit}
          />}

          {playerOneImage !== null &&
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}
              onReset={this.handleReset}
              id='playerOne'
            />}

          {!playerTwoName && <PlayerInput
            id='playerTwo'
            label='Player Two'
            onSubmit={this.handleSubmit}
          />}

          {playerTwoImage !== null &&
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}
              onReset={this.handleReset}
              id='playerTwo'
            />}
        </div>

         {/* makes sure playerone and player two have rendered */}
        {playerOneImage && playerTwoImage &&
        <Link
          className='button'
          to={{
            pathname: this.props.match.url + '/results',
            search: `?playerOneName=` + playerOneName + `&playerTwoName=` + playerTwoName
          }}>
          Battle
        </Link>}
      </div>

    )
  }
}

module.exports = Battle;