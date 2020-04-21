import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components';

import { generateApiToken, saveApiToken, parseCookies, getUser } from './functions';
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

  renderHomePage = () => {
    return (
      this.state.userId && 
        this.state.userSpotifyId ?
          <Playlist /> :
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
          <Route path="/swaps">
            <Join />
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
