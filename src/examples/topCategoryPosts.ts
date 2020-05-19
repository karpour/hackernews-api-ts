import HackerNews from '../HackerNews';

// Method 1

HackerNews.TYPES.forEach(type => {
    HackerNews.getStories(type, 0, 1)
        .then(stories => console.log(`Top ${type} story: ${stories[0].title}`));
});

// Method 2

async function getStories() {
    console.log(`Top new story: ${(await HackerNews.getNewStories(0, 1))[0].title}`);
    console.log(`Top top story: ${(await HackerNews.getTopStories(0, 1))[0].title}`);
    console.log(`Top best story: ${(await HackerNews.getBestStories(0, 1))[0].title}`);
    console.log(`Top show story: ${(await HackerNews.getShowStories(0, 1))[0].title}`);
    console.log(`Top ask story: ${(await HackerNews.getAskStories(0, 1))[0].title}`);
    console.log(`Top job story: ${(await HackerNews.getJobStories(0, 1))[0].title}`);
}

getStories();