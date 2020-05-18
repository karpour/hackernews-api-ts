import HackerNews from '../HackerNews';

HackerNews.getMaxItem()
    .then(item => HackerNews.getUser(item.by))
    .then(user => { if(user) console.log(`Latest item was posted by ${user.id} [${user.karma}]`) });