import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components';

import { colors } from './globalStyles';
import { getUser } from './api';

import Landing from './pages/landing';
import Playlist from './pages/playlists';
import Error from './pages/error';
import Lost from './pages/lost';
import Header from './components/header';
import Footer from './components/footer';
import How from './pages/how';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    }
  }

  componentDidMount = async () => {
    try {
      const user = await getUser();

      user &&
        this.setState({
          user
        })
    }
    catch(err) {
      console.log(err)
    }
  }

  renderHomePage = () => {
    return (
      this.state.user ?
        <Playlist 
          apiToken={this.state.user.apiToken}
          userId={this.state.user.userId}
          spotifyId={this.state.user.spotifyId}
          displayName={this.state.user.displayName || ''}
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
          <Route path="/how-it-works">
            <How />
          </Route>
          <Route path="/404">
            <Error />
          </Route>
          <Route path="/*">
            <Lost />
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
