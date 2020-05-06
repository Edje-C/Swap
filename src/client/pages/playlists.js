import React, { Component } from "react";
import styled from 'styled-components';
import moment from "moment";
import { colors, fontSizes, fontWeights, boxShadows, breakpoints } from "../globalStyles";
import { getPlaylists } from "../api";
import { ellipsisInCenter } from "../functions";
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
      playlists: [],
      selectedPlaylist: -1,
      newPassword: ''
    };
  }

  componentDidMount = async () => {
    try {
      const playlists = await getPlaylists(this.props.apiToken, this.props.userId);

      this.setState({
        playlists
      })
    }
    catch(err) {
      console.log(err)
    }
  }

  addPlaylistToState = (playlist) => {
    const updatedPlaylists = [
      ...this.state.playlists
    ]

    updatedPlaylists.unshift(playlist)

    this.setState({
      playlists: updatedPlaylists,
      selectedPlaylist: this.state.selectedPlaylist + 1
    })
  }

  updatePlaylistLink = (link) => {
    const updatedPlaylists = [
      ...this.state.playlists
    ]
    const updatedPlaylist = {
      ...this.state.playlists[this.state.selectedPlaylist]
    }

    updatedPlaylist['link'] = link;

    updatedPlaylists[this.state.selectedPlaylist] = updatedPlaylist

    this.setState({
      playlists: updatedPlaylists
    })
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
          apiToken={this.props.apiToken}
          userId={this.props.userId}
          displayName={this.props.displayName}
          spotifyId={this.props.spotifyId}
          addPlaylistToState={this.addPlaylistToState}
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
          apiToken={this.props.apiToken}
          userId={this.props.userId}
          displayName={this.props.displayName}
          spotifyId={this.props.spotifyId}
          updatePlaylistLink={this.updatePlaylistLink}
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
          apiToken={this.props.apiToken}
          userId={this.props.userId}
          displayName={this.props.displayName}
          spotifyId={this.props.spotifyId}
          addPlaylistToState={this.addPlaylistToState}
        />
      </Modal>
    )
  }

  renderPlaylists = () => {
    return (
      <Playlists>
        {this.state.playlists.map((playlist, index) => {
          return (
            <PlaylistCard>
              <PlaylistTitle href={playlist.link}>{playlist.title}</PlaylistTitle>
              <PlaylistDetail>{playlist.creator.displayName}</PlaylistDetail>
              <PlaylistDetail>
                {moment(playlist.createdAt).format('LL')}
              </PlaylistDetail>
              {playlist.link ? 
                <PlaylistLink href={playlist.link} target="_blank">{ellipsisInCenter(playlist.link.replace('https://', ''), 12)}</PlaylistLink> :
                <PendingDetail>Pending</PendingDetail>}
              <ShareButton 
                onClick={() => {
                  this.setState({
                    renderPlaylistDetailsModal: true,
                    selectedPlaylist: index
                  })
                }}
              >
                Details
              </ShareButton>
            </PlaylistCard>
          )
        })}
      </Playlists>
    )
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
        {this.state.playlists &&
          this.state.playlists.length ? 
          this.renderPlaylists() :
          <BlankStateMessage>Get started by joining or creating a Swap.</BlankStateMessage>}
      </Container>
    )
  }
}

const Container = styled.div`
  min-height: calc(100% - 190px);
  display: flex;
  flex-direction: column;
  padding: 0px 100px;

  @media (max-width: ${breakpoints.medium}) {
    padding: 0px 50px;
  }
`;

const Header = styled.div`
  width: 100%;
  max-width: 1500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px auto 75px;
  padding: 50px 25px;
  border-bottom: 2px solid ${colors.white};

  @media (max-width: ${breakpoints.large}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Heading = styled.p`
  color: ${colors.white};
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: ${fontSizes.xlarge};
  margin-right: 20px;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${breakpoints.large}) {
    width: 100%;
    margin: 0px auto 30px;
  }
`;

const HeaderButtons = styled.div`
  display: flex;

  @media (max-width: ${breakpoints.xsmall}) {
    flex-direction: column;
    align-items: center;
  }
`;

const JoinPlaylistButton = styled(Button)`
  background: none;
  border: 2px solid ${colors.white};
  color: ${colors.white};
  margin-right: 50px;

  &:hover {
    background: ${colors.purple};
    color: ${colors.white};
    border: 2px solid ${colors.purple};
  }

  @media (max-width: ${breakpoints.xsmall}) {
    margin: 0px auto 20px;
  }
`;

const NewPlaylistButton = styled(Button)`
  background: none;
  border: 2px solid ${colors.white};
  color: ${colors.white};
  
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

  @media (max-width: ${breakpoints.xlarge}) {
    width: 45%;
    margin: 0px 2.5% 50px;
  }

  @media (max-width: ${breakpoints.medium}) {
    width: 100%;
    max-width: 350px;
    margin: 0px auto 50px;
  }
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
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PlaylistLink = styled.a`
  width: fit-content;
  color: ${colors.opaqueBlue};
  font-size: ${fontSizes.xsmall};
  margin-bottom: 5px;

  &::after {
    width: 100%;
    height: 1px;
    background: none;
    display: block;
    content: ''
  }

  &:hover {
    &::after {
      background: ${colors.opaqueBlue};
    }
  }  
`

const PendingDetail = styled.p`
  color: ${colors.opaqueBlue};
  font-size: ${fontSizes.xsmall};
  margin-bottom: 5px;
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

const BlankStateMessage = styled.p`
  color: ${colors.opaqueWhite3};
  font-size: ${fontSizes.large};
`;

export default Playlist;
