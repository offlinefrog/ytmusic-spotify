import { searchList } from "./sp_searchList.js"

async function makePlaylist(token, name, url){
    const user = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const { userid } = await user.json().id;

    const result = await fetch("https://api.spotify.com/v1/users/"+userid+"/playlists", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
        data: { "name": name,
                "description": url,
                "public": false
        }
    });

    const { id } = await result.json().id;
    return id;
}

export async function populatePlaylist(token, name, list, url){
    const id = await makePlaylist(token, name, url);
    const idLst = await searchList(list, token);
    const result = await fetch("https://api.spotify.com/v1/playlists/" + id + "/tracks", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
        data: { "uris": idLst }
    });
}