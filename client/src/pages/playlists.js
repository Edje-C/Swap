import React, { Component } from "react";
import styled from 'styled-components';
import moment from "moment";
import { colors, fontSizes, fontWeights, boxShadows } from "../globalStyles";
import { getPlaylists } from "../api";
import { samplePlaylist } from "../sampleData";
import Modal from "../components/modal";
import NewPlaylist from "../components/newPlaylist";
import PlaylistDetails from "../components/playlistDetails";
import JoinPlaylist from "../components/joinPlaylist";
import Button from "../components/button";

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderPlaylistDetailsModal: false,
      renderNewPlaylistModal: false,
      renderJoinPlaylistModal: false,
      playlists: [samplePlaylist, samplePlaylist, samplePlaylist, samplePlaylist, samplePlaylist],
      selectedPlaylist: -1,
      newPassword: ''
    };
  }

  componentDidMount = async () => {
    try {
      const playlists = await getPlaylists(this.props.userId);

      this.setState({
        playlists
      })
    }
    catch(err) {
      console.log(err)
    }
  }

  renderNewPlaylistModal = () => {
    return (
      <Modal
        onClick={() => {
          this.setState({
            renderNewPlaylistModal:false
          })
        }}
      >
        <NewPlaylist
          userId={this.props.userId}
          displayName={this.props.displayName}
          spotifyId={this.props.spotifyId}
        />
      </Modal>
    )
  }

  renderPlaylistDetailsModal = () => {
    const playlist = this.state.playlists[this.state.selectedPlaylist];
    const passwordHasExpired = new Date(playlist.passwordExpiration) <= new Date();

    return (
      <Modal
        onClick={() => {
          this.setState({
            renderPlaylistDetailsModal:false
          })
        }}
      >
        <PlaylistDetails
          playlist={playlist}
          passwordHasExpired={passwordHasExpired}
          userId={this.props.userId}
          displayName={this.props.displayName}
          spotifyId={this.props.displspotifyId}
        />
      </Modal>
    )
  }

  renderJoinPlaylistModal = () => {
    return (
      <Modal
        onClick={() => {
          this.setState({
            renderJoinPlaylistModal:false
          })
        }}
      >
        <JoinPlaylist
          userId={this.props.userId}
          displayName={this.props.displayName}
          spotifyId={this.props.displspotifyId}
        />
      </Modal>
    )
  }

  renderPlaylists = () => {
    console.log(this.state)
    return this.state.playlists.map((playlist, index) => {
      return (
        <PlaylistCard>
          <PlaylistTitle href={playlist.link}>{playlist.title}</PlaylistTitle>
          <PlaylistDetail>{playlist.creator.displayName}</PlaylistDetail>
          <PlaylistDetail>
            {moment(playlist.createdAt).format('LL')}
          </PlaylistDetail>
          <ShareButton 
            onClick={() => {
              this.setState({
                renderPlaylistDetailsModal: true,
                selectedPlaylist: index
              })
            }}
          >
            Share
          </ShareButton>
        </PlaylistCard>
      )
    })
  }

  render() {
    return (
      <Container>
        {this.state.renderPlaylistDetailsModal && this.renderPlaylistDetailsModal()}
        {this.state.renderNewPlaylistModal && this.renderNewPlaylistModal()}
        {this.state.renderJoinPlaylistModal && this.renderJoinPlaylistModal()}
        <Header>
          <Heading>{this.props.displayName}</Heading>
          <HeaderButtons>
            <JoinPlaylistButton
              onClick={() => {
                this.setState({
                  renderJoinPlaylistModal: true
                });
              }}
            >
              Join
            </JoinPlaylistButton>
            <NewPlaylistButton
              onClick={() => {
                this.setState({
                  renderNewPlaylistModal: true
                });
              }}
            >
              Create
            </NewPlaylistButton>
          </HeaderButtons>
        </Header>
        <Playlists>
          {this.renderPlaylists()}
        </Playlists>
      </Container>
    )
  }
}

const Container = styled.div`
  min-height: calc(100% - 190px);
  display: flex;
  flex-direction: column;
  padding: 0px 100px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px 0px 75px;
  padding: 50px 25px;
  border-bottom: 2px solid ${colors.white};
`;

const Heading = styled.p`
  color: ${colors.white};
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: ${fontSizes.xlarge};
`;

const HeaderButtons = styled.div`
  display: flex;
`;

const JoinPlaylistButton = styled(Button)`
  background: none;
  border: 2px solid ${colors.white};
  color: ${colors.white};

  &:hover {
    background: ${colors.purple};
    color: ${colors.white};
    border: 2px solid ${colors.purple};
  }
`;

const NewPlaylistButton = styled(Button)`
  background: none;
  border: 2px solid ${colors.white};
  color: ${colors.white};
  margin-left: 20px;
  
  &:hover {
    background: ${colors.lightBlue};
    color: ${colors.white};
    border: 2px solid ${colors.lightBlue};
  }
`;

const Playlists = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-wrap: wrap;
  margin: 0px auto 50px;
`;

const PlaylistCard = styled.div`
  width: 30%;
  background: rgba(255, 255, 255, .2);
  display: flex;
  flex-direction: column;
  margin: 0px 1.66% 50px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: ${boxShadows.blue1};
`;

const PlaylistTitle = styled.p`
  width: 100%;
  color: ${colors.white};
  font-size: ${fontSizes.medium};
  font-weight: ${fontWeights.regular};
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PlaylistDetail = styled.div`
  width: 90%;
  color: ${colors.opaqueWhite3};
  font-size: ${fontSizes.xsmall};
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ShareButton = styled(Button)`
  background: ${colors.opaqueWhite1};
  color: ${colors.opaqueBlue};
  margin: 30px 0px 0px auto;
  border: 2px solid transparent;

  &:hover {
    color: ${colors.purple};
    background: ${colors.white};
  }
`;

export default Playlist;