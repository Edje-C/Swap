import React, { Component } from "react";
import styled from 'styled-components';
import moment from "moment";
import { colors, fontSizes, fontWeights, boxShadows } from "../globalStyles";
import { getPlaylists, saveToClipboard } from "../functions";

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
            <ModalLink
              onClick={() => {
                saveToClipboard(`http://localhost:3000/playlists/${playlist._id}`);
              }}
            >
              {`http://localhost:3000/playlists/${playlist._id}`}
              <ModalLinkCopy>copy</ModalLinkCopy>
            </ModalLink>
          </ModalHeader>
          <ModalDetails>
            <ModalDetail>creator: {playlist.creator && playlist.creator.spotifyId || ''}</ModalDetail>
            <ModalDetail>date: {moment(playlist.createdAt).format('LL')}</ModalDetail>
            <ModalDetail>collaborators: {playlist.collaborators}</ModalDetail>
            <ModalDetail>password expiry: {moment(playlist.passwordExpiration).format('LLL')}</ModalDetail>
            {this.state.newPassword ?
              <NewPasswordText>value={this.state.newPassword}</NewPasswordText> :
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
    return (
      <Container>
        {this.state.renderModal && this.renderModal()}
        <NewPlaylistButton><NewPlaylistIcon className="material-icons">add</NewPlaylistIcon></NewPlaylistButton>
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
  padding: 50px 100px;
`;

const NewPlaylistButton = styled.button`
  width: 75px;
  height: 75px;
  background: ${colors.purple};
  color: ${colors.white};
  border-radius: 100%;
  position: absolute;
  bottom: 125px;
  right: 75px;
  box-shadow:  ${boxShadows.blue2};
`;

const NewPlaylistIcon = styled.span`
  font-size: ${fontSizes.xlarge};
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
  margin-bottom: 50px;
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
  transition: all .3s ease;

  &:hover {
    color: ${colors.blue};
    background: ${colors.white};
    box-shadow: ${boxShadows.blue1};
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
  color: ${colors.gray};
  font-size: ${fontSizes.xsmall};
  padding: 50px;
  border-radius: 10px;
  box-shadow: ${boxShadows.blue2};

  animation: .2s ease slidein;

  @keyframes slidein {
    0% {
      margin-top: 100px;
    },
    100% {
      margin-top: 0px;
    }
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.gray};
`;

const ModalTitle = styled.p`
  color: ${colors.darkGray};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.medium};
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalLink = styled.button`
  background: ${colors.lightPurple};
  color: ${colors.gray};
  font-size: ${fontSizes.xsmall};
  font-weight: ${fontWeights.semiLight};
  padding: 5px 68px 5px 8px;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: ${colors.opaqueWhite1};
  }
`;

const ModalLinkCopy = styled.p`
  width: 60px;
  height: 100%;
  background: ${colors.opaqueWhite3};
  padding: 5px 8px;
  position: absolute;
  top: 0;
  right: 0;

  ${ModalLink}:hover & {
    color: ${colors.gray};
  }
`;

const ModalDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalDetail = styled.p`
  margin-bottom: 20px;
`;

const NewPasswordText = styled.p``;

const NewPasswordButton = styled.button`
  width: 100%;
  background: none;
  color: ${colors.opaqueBlue};
  font-size: ${fontSizes.xsmall};
  margin-top: 20px;
  padding: 5px 0px;
`;

export default Playlist;
