import playwright from 'playwright';
import * as cheerio from 'cheerio';

async function loadPage(url){
    const browser = await playwright.firefox.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const html = await page.content();
    await browser.close();
    return html;
}

export async function getPlaylistInfo(url){
    const html = await loadPage(url);
    const $ = cheerio.load(html);
    
    const chunk = $('html').find('div#contents.style-scope.ytmusic-playlist-shelf-renderer');

    const titles = [...chunk].map(e => [...$(e).find('div.title-column.style-scope.ytmusic-responsive-list-item-renderer')]
        .map(e => $(e).extract({ title: 'yt-formatted-string'})))[0];
    
    const artists = [...chunk].map(e => [...$(e).find('div.secondary-flex-columns.style-scope.ytmusic-responsive-list-item-renderer')]
        .map(e => $(e).extract({ artist: 'yt-formatted-string'})))[0];

    const albums = [...chunk].map(e => [...$(e).find('div.secondary-flex-columns.style-scope.ytmusic-responsive-list-item-renderer')]
        .map(e => $(e).extract({ album: 'yt-formatted-string:nth-child(2)'})))[0];
    
    const data = titles.map((value, index) => ({
        ...value,
        ...artists[index],
        ...albums[index]
    }));

    return data;
}