import { getPlaylistInfo } from "./ytm_playlistInfo.js"
import { returnAccessToken } from "./sp_accessToken.js"
import { populatePlaylist } from "./sp_playlistAdd.js"

const url = document.getElementById("playlisturl") as HTMLInputElement
const name = document.getElementById("playlistname") as HTMLInputElement
const portButton = document.getElementById("portBtn") as HTMLButtonElement
const result = document.getElementById("result") as HTMLOutputElement

function port(): void{
    const namestr = name.outerText;
    const info = getPlaylistInfo(url);
    const access = returnAccessToken();
    populatePlaylist(access, namestr, info, url);
    result.textContent = namestr + "has been created";
}

portButton.addEventListener("click", port);