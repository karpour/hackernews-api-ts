import HackerNews from '../HackerNews';

HackerNews.TYPES.forEach(type => {
    HackerNews.getStories(type,0,1)
    .then(stories => console.log(`Top ${type} story: ${stories[0].title}`));
});