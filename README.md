# Hacker News Typescript API

A clean Typescript client for the [Hacker News API](https://github.com/HackerNews/API).

## Dependencies

* [node-fetch](https://www.npmjs.com/package/node-fetch)

## Examples

### Get newest stories

```typescript
import HackerNews from 'hackernews-api-ts';

HackerNews.getStories(HackerNews.TYPE_TOP, 0, 5)
    .then(stories => {
        let i=1;
        stories.forEach(story => console.log(`${i++}. ${story.title} [${story.score}] (${story.url})}`))
    });
```

### List item/user updates

```typescript
import HackerNews from 'hackernews-api-ts';

HackerNews.getUpdates().then(updates => console.log(updates));
```

### Get user info for user of newest post

```typescript
import HackerNews from 'hackernews-api-ts';

HackerNews.getMaxItem()
    .then(item => HackerNews.getUser(item.by))
    .then(user => { if(user) console.log(`Latest item was posted by ${user.id} [${user.karma}]`) });
```

### Get top posts for each category

```typescript
import HackerNews from 'hackernews-api-ts';

HackerNews.TYPES.forEach(type => {
    HackerNews.getStories(type,0,1)
    .then(stories => console.log(`Top ${type} story: ${stories[0].title}`));
});
```
