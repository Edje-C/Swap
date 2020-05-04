import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components';

import { saveApiToken, getUser } from './api';
import { generateApiToken } from './functions';
import { colors } from './globalStyles';

import Landing from './pages/landing';
import Playlist from './pages/playlists';
import Error from './pages/error';
import Header from './components/header';
import Footer from './components/footer';
import How from './pages/how';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiToken: '',
      userId: '',
      spotifyId: '',
      displayName: ''
    };
  }

  componentDidMount = async () => {
    try {
      const apiToken = generateApiToken();
      await saveApiToken(apiToken);
      this.setState({
        apiToken
      })
    }
    catch(err) {
      console.log(err)
    }

    try {
      const user = await getUser(this.state.apiToken);

      user &&
        this.setState({
          userId: user.userId,
          spotifyId: user.spotifyId,
          displayName: user.displayName
        })
    }
    catch(err) {
      console.log(err)
    }
  }

  renderHomePage = () => {
    return (
      this.state.apiToken && 
      this.state.userId && 
      this.state.spotifyId && 
      this.state.displayName ?
        <Playlist 
          apiToken={this.state.apiToken}
          userId={this.state.userId}
          spotifyId={this.state.spotifyId}
          displayName={this.state.displayName}
        /> :
        <Landing /> 
      )
  }

  render() {
    const img = require('./static/logo.png')
    console.log(img)
    return (
      <Container>
        <Header/>
        <Switch>
          <Route exact path="/">
            {this.renderHomePage()}
          </Route>
          <Route path="/how-it-works">
            <How />
          </Route>
          <Route path="/*">
            <Error />
          </Route>
        </Switch>
        <Footer/>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, ${colors.blue}, ${colors.cyan});
  overflow: auto;
`;

export default App;