import React, { Component } from "react";
import styled from 'styled-components';
import moment from "moment";
import { colors, fontSizes, fontWeights, boxShadows } from "../globalStyles";
import { getPlaylists } from "../api";
import { samplePlaylist } from "../sampleData";
import NewPlaylist from "../components/newPlaylist";
import SharePlaylist from "../components/sharePlaylist";

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderPlaylistDetailsModal: false,
      renderNewPlaylistModal: false,
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
      <ModalBackground 
        onClick={(event) => {
          this.setState({
            renderNewPlaylistModal: false
          })
        }}
      >
        <NewPlaylist/>
      </ModalBackground>
    )
  }

  renderPlaylistDetailsModal = () => {
    const playlist = this.state.playlists[this.state.selectedPlaylist];
    const passwordHasExpired = new Date(playlist.passwordExpiration) <= new Date();

    return (
      <ModalBackground 
        onClick={(event) => {
          this.setState({
            renderPlaylistDetailsModal: false,
            selectedPlaylist: -1,
            newPassword: ''
          })
        }}
      >
        <SharePlaylist
          playlist={playlist}
          passwordHasExpired={passwordHasExpired}
        />
      </ModalBackground>
    )
  }

  renderPlaylists = () => {
    return this.state.playlists.map((playlist, index) => {
      return (
        <PlaylistCard>
          <PlaylistTitle href={playlist.link}>{playlist.title}</PlaylistTitle>
          <PlaylistDetails>
            <PlaylistByLine>{playlist.creator.spotifyId}</PlaylistByLine>
            <PlaylistDate>
              {moment(playlist.createdAt).format('LL')}
            </PlaylistDate>
          </PlaylistDetails>
          <PlaylistLink href={playlist.link}>{playlist.link.replace('https://open.', '')}</PlaylistLink>
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
        <Header>
          <Heading>{this.props.displayName}</Heading>
          <NewPlaylistButton
            onClick={() => {
              this.setState({
                renderNewPlaylistModal: true
              });
            }}
          >
              New Swap
          </NewPlaylistButton>
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

const NewPlaylistButton = styled.button`
  width: 200px;
  background: none;
  border: 2px solid ${colors.white};
  color: ${colors.white};
  font-size: ${fontSizes.regular};
  padding: 15px 0px;
  border-radius: 50px;
  box-shadow:  ${boxShadows.blue1};
  transition: all .2s ease;

  &:hover {
    box-shadow:  ${boxShadows.blue2};
    background: ${colors.purple};
    color: ${colors.white};
    border: 2px solid ${colors.purple};
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

const PlaylistDetails = styled.div`
  width: 90%;
  color: ${colors.opaqueWhite3};
  font-size: ${fontSizes.xsmall};
  font-size: ${fontWeights.light};
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`

const PlaylistByLine = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlaylistDate = styled.p`
  margin-left: 10px
`;

const PlaylistLink = styled.a`
  width: min-content;
  max-width: 70%;
  font-size: ${fontSizes.small};
  margin-bottom: 40px;
  color: ${colors.opaqueBlue};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &::after {
    content: '';
    width: 60%;
    height: 2px;
    background: ${colors.opaqueBlue};
    display: flex;
    margin-top: 2px;
    transition: all .2s ease;
  }
  
  &:hover {
    color: ${colors.blue};
  }
  
  &:hover::after {
    width: 100%;
    background: ${colors.blue};
  }
`

const ShareButton = styled.button`
  width: 150px;
  background: ${colors.opaqueWhite1};
  color: ${colors.opaqueBlue};
  font-size: ${fontSizes.small};
  margin-left: auto;
  padding: 8px 0px;
  border: 2px solid transparent;
  border-radius: 50px;
  box-shadow: ${boxShadows.blue1};
  transition: all .3s ease;

  &:hover {
    color: ${colors.purple};
    background: ${colors.white};
    box-shadow: ${boxShadows.blue2};
  }
`;

const ModalBackground = styled.div`
  width: 100%;
  height: 100%;
  background: ${colors.opaqueBlack};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
`;

export default Playlist;
