import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components';

import { generateApiToken, saveApiToken, parseCookies, getUser } from './functions';

import Home from './pages/home';
import Login from './pages/login';
import Playlist from './pages/playlist';
import Error from './pages/error';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      userSpotifyId: ''
    };
  }

  componentDidMount = async () => {
    if(!parseCookies().apiToken) {
      try {
        const apiToken = generateApiToken();
        await saveApiToken(apiToken)
        document.cookie = `apiToken=${apiToken}`;
      }
      catch(err) {
        console.log(err)
      }
    }

    try {
      const user = await getUser();
      user &&
        this.setState({
          userId: user._id,
          userSpotifyId: user.spotifyId
        })
    }
    catch(err) {
      console.log('Error', err)
    }
  }

  render() {
    return (
      <Container>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/playlists">
            <Playlist />
          </Route>
          <Route path="/*">
            <Error />
          </Route>
        </Switch>
      </Container>
    );
  }
}

const Container = styled.div`
  background-color: #131420;
  background: linear-gradient(to bottom, #131420, #1E192A);
`;

export default App;
