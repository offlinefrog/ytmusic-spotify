from ytmusicapi import YTMusic
import spotipy
from spotipy.oauth2 import SpotifyOAuth

ytmusic = YTMusic()

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id="7b8562fd40ca4cb4aa2197b886d9ae62",
                                               client_secret="CLIENT_SECRET_HERE",
                                               redirect_uri="http://localhost/",
                                               scope="playlist-modify-private playlist-read-private"))

playlistUrl = input("playlist url: ")

def getInfo(dict):
    def getArtists(dict):
        name = dict['name']
        return name

    def getAlbum(dict):
        album = dict['album']
        if album != None:
            return album['name']
        else:
            return 'None'

    lst = dict['artists']
    artists = map(getArtists,lst)
    info = [dict['title'],list(artists),getAlbum(dict)]
    return info

def ytm_main():
    urlList = playlistUrl.split("=")
    playlistId = urlList[-1]
    data = ytmusic.get_playlist(playlistId=playlistId, limit=None)
    tracks = data['tracks']
    playlistInfo = list(map(getInfo,tracks))
    return playlistInfo

def search(lst):
    title = lst[0]
    artists = lst[1]
    artistlst = ' + '.join(artists)
    album = lst[2]
    query = 'track: ' + title + ' artist: ' + artistlst + ' album: ' + album + ' market: US'
    result = sp.search(q=query,limit=10,type='track')
    id = result['tracks']['items'][0]['id']
    return id

def listTracks():
    trackList = ytm_main()
    resultList = list(map(search,trackList))
    return resultList

def findPlaylist(name):
    dict = sp.current_user_playlists()
    info = dict['items']
    playlistDict = {i['name']: i['external_urls'].get('spotify') for i in info}
    return playlistDict[name]

def main():
    user_id = sp.current_user()['id']
    name = input("playlist name: ")
    sp.user_playlist_create(user=user_id,name=name,public=False,description=playlistUrl)
    playlist = findPlaylist(name)
    sp.playlist_add_items(playlist_id=playlist,items=listTracks())

if __name__ == '__main__':
    main()
