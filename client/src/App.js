import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components';

import { saveApiToken, getUser } from './api';
import { generateApiToken, parseCookies } from './functions';
import { colors } from './globalStyles';

import Landing from './pages/landing';
import Playlist from './pages/playlist';
import Join from './pages/join';
import Error from './pages/error';
import Header from './components/header';
import Footer from './components/footer';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      userSpotifyId: '',
      displayName: ''
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
          userSpotifyId: user.spotifyId,
          displayName: user.displayName
        })
    }
    catch(err) {
      console.log('Error', err)
    }
  }

  renderHomePage = () => {
    return (
      this.state.userId && 
      this.state.userSpotifyId && 
      this.state.displayName ?
        <Playlist 
          userId={this.state.userId}
          userSpotifyId={this.state.userSpotifyId}
          displayName={this.state.displayName}
        /> :
        <Landing /> 
      )
  }

  render() {
    return (
      <Container>
        <Header/>
        <Switch>
          <Route exact path="/">
            {this.renderHomePage()}
          </Route>
          <Route path="/swaps/:id">
            <Join
              userId={this.state.userId}
              userSpotifyId={this.state.userSpotifyId}
              displayName={this.state.displayName}
            />
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
