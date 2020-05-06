import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components';

import { colors } from './globalStyles';

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
  }

  renderHomePage = () => {
    return (
      this.props.apiToken && 
      this.props.userId && 
      this.props.spotifyId ?
        <Playlist 
          apiToken={this.props.apiToken}
          userId={this.props.userId}
          spotifyId={this.props.spotifyId}
          displayName={this.props.displayName || ''}
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
