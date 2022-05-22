import React from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      "searchResults": [],
      "playlistName": "",
      "playlistTracks": []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.find(trackIndex => trackIndex.id === track.id)) {
      this.state.playlistTracks.push(track);
      this.setState({playlistTracks: this.state.playlistTracks});
    }
  }

  removeTrack(track){
    let newTracks = this.state.playlistTracks.filter(trackIndex => trackIndex.id !== track.id);
    this.setState({playlistTracks: newTracks});
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist() {
    if(this.state.playlistTracks.length && this.state.playlistName) {
      let trackURIs = this.state.playlistTracks.map(trackIndex => trackIndex.uri);
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
        this.setState({
          playlistName: '',
          playlistTracks: []
        });
        document.getElementById('Playlist-name').value = this.state.playlistName;
      });
    }
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(results => {
      this.setState({searchResults: results});
    });
  }

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
  
}

export default App;
