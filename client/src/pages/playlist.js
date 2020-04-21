import React, { Component } from "react";
import styled from 'styled-components';
import moment from "moment";
import { colors, fontSizes, fontWeights, images } from "../globalStyles";
import { getPlaylists } from "../functions";

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderModal: false,
      playlists: [],
      selectedPlaylist: -1,
      newPassword: ''
    };
  }

  componentDidMount = async () => {
    try {
      const playlists = await getPlaylists();
      this.setState({
        playlists
      })
    }
    catch(err) {
      console.log(err)
    }
  }

  renderModal = () => {
    const playlist = this.state.playlists[this.state.selectedPlaylist];

    return (
      <ModalBackground 
        onClick={(event) => {
          this.setState({
            renderModal: false,
            selectedPlaylist: -1,
            newPassword: ''
          })
        }}
      >
        <ModalContent
          onClick={(event)=> 
            event.stopPropagation()}
        >
          
          <ModalHeader>
            <ModalTitle>{playlist.title}</ModalTitle>
            <ModalLink>{`http://localhost:3000/playlists/${playlist.spotifyPlaylistId}`}</ModalLink>
          </ModalHeader>
          <ModalDetails>
            {/* <ModalDetail>creator: {playlist.creator}</ModalDetail> */}
            <ModalDetail>date: {playlist.createdAt}</ModalDetail>
            <ModalDetail>collaborators: {playlist.collaborators}</ModalDetail>
            <ModalDetail>password expiry: {playlist.passwordExpiration}</ModalDetail>
            {this.state.newPassword ?
              <NewPasswordText>{this.state.newPassword}</NewPasswordText> :
              <NewPasswordButton>generate new password</NewPasswordButton>}
          </ModalDetails>
        </ModalContent>
      </ModalBackground>
    )
  }

  renderPlaylists = () => {
    return this.state.playlists.map((playlist, index) => {
      return (
        <PlaylistCard>
          <PlaylistTitle href={playlist.link}>{playlist.title}</PlaylistTitle>
          <PlaylistDetails>
            <PlaylistByLine>alittleify</PlaylistByLine>
            <PlaylistDate>
              {moment(playlist.createdAt).format('LL')}
            </PlaylistDate>
          </PlaylistDetails>
          <PlaylistLink href={playlist.link}>{playlist.link.replace('https://open.', '')}</PlaylistLink>
          <ShareButton 
            onClick={() => {
              this.setState({
                renderModal: true,
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
    console.log(this.state.playlists)
    return (
      <Container>
        {this.state.renderModal && this.renderModal()}
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
  margin-top: 115px;
  padding: 100px;
`;

const Playlists = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0px auto;
`;

const PlaylistCard = styled.div`
  width: 30%;
  background: rgba(255, 255, 255, .2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 40px -10px rgba(46, 46, 70,.3);
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
  margin-bottom: 35px;
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
  color: ${colors.blue};
  font-size: ${fontSizes.small};
  margin-left: auto;
  padding: 8px 0px;
  border: 2px solid transparent;
  border-radius: 50px;
  transition: all .3s ease;

  &:hover {
    background: ${colors.white};
    box-shadow: 0 10px 20px -10px rgba(46, 46, 70,.3);
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

const ModalContent = styled.div`
  width: 500px;
  height: 500px;
  background: ${colors.white};
  border-radius: 10px;
  postions: relative
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${colors.lightPurple};
`;

const ModalTitle = styled.p``;

const ModalLink = styled.input``;

const ModalDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalDetail = styled.p``;

const NewPasswordButton = styled.button``;

const NewPasswordText = styled.input``;

export default Playlist;
