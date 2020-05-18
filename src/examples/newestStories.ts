import HackerNews from '../HackerNews';

HackerNews.getStories(HackerNews.TYPE_TOP, 0, 5)
    .then(stories => {
        let i=1;
        stories.forEach(story => console.log(`${i++}. ${story.title} [${story.score}] (${story.url})}`))
    });