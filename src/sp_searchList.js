async function searchItem(item, token){
    
    const params = new URLSearchParams();
    params.append('track', item.title);
    params.append('artist', item.artist);
    params.append('album', item.album);
    const sp_params = params.toString().replaceAll('=', '%3A').replaceAll('&', '+');
    const query = 'q=' + sp_params + '&type=track&market=US';

    const result = await fetch("https://api.spotify.com/v1/search?" + query, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    const { id } = await result.json().tracks.items[0].id;
    return id;
    
}

export async function searchList(list, token){
    const id_list = list.map(i => searchItem(i, token));
    return id_list;
}