var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');
var Loading = require('./Loading');

function RepoGrid (props) {
  return (
    <ul className='popular-list'>
      {props.repos.map(function (repo, index){
        return (
          <li key={repo.name} className='popular-item'>
            <div className='popular-rank'>#{index + 1}</div>
            <ul className='space-list-items'>
              <li>
                <img
                  className='avatar'
                  src={repo.owner.avatar_url}
                  alt={'Avatar for ' + repo.owner.login}/>
              </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

function SelectLanguage(props) {
  var languages = [
    'All',
    'Javascript',
    'Ruby',
    'Java',
    'CSS',
    'Python',
    'Golang'
  ];

  return (
    <ul className='languages'>
      {languages.map(function (lang) {
        return (
          <li style={lang === props.selectedLanguage
            ? {
              color: '#d0021b'
            }
            : null} onClick={props.onSelect.bind(null, lang)} key={lang}>
            {lang}
          </li>
        )
      })}
    </ul>
  )
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

class Popular extends React.Component {
  constructor(props) {
    super(props);
    // used to create a state
    this.state = {
      repos: null,
      selectedLanguage: 'All'
    }
    // always linking to component
    this.updateLanguage = this.updateLanguage.bind(this);
  }
  // lifecycle event for ajax Call
  componentDidMount () {
    this.updateLanguage(this.state.selectedLanguage);
  }
  // setting state for clicked language
  updateLanguage(lang) {
    this.setState(function() {
      return {
        repos: null,
        selectedLanguage: lang
      }
    });

    api.fetchPopularRepos(this.state.selectedLanguage)
      .then(function(repos) {
        this.setState(function () {
          return {
            repos: repos
          }
        })
      }.bind(this));
  }

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {!this.state.repos
        ? <Loading text='Hold up' speed={50}/>
        : <RepoGrid repos={this.state.repos} />}
      </div>
    )
  }
}

module.exports = Popular;
