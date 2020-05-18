import fetch from 'node-fetch';

enum HackerNewsStoryTypes { top = "top", new = "new", best = "best", ask = "ask", show = "show", job = "job" };

type HackerNewsItemId = number;
type HackerNewsUserId = string;
type HackerNewsStoryType = HackerNewsStoryTypes;
type HackerNewsType = "job" | "story" | "comment" | "poll" | "pollopt";

const apiUrl = 'https://hacker-news.firebaseio.com/v0/';



export interface HackerNewsItem {
    id: HackerNewsItemId, // The item's unique id.
    deleted: boolean, // true if the item is deleted.
    type: HackerNewsType, // The type of item. One of "job", "story", "comment", "poll", or "pollopt".
    by: HackerNewsUserId, // The username of the item's author.
    time: number, // Creation date of the item, in Unix Time.
    text: string, // The comment, story or poll text. HTML.
    dead: boolean, // true if the item is dead.
    parent: HackerNewsItemId | null, // The comment's parent: either another comment or the relevant story.
    poll: HackerNewsItemId | null, // The pollopt's associated poll.
    kids: HackerNewsItemId[], // The IDs of the item's comments, in ranked display order.
    url: string, // The URL of the story.
    score: number, // The story's score, or the votes for a pollopt.
    title: string, // The title of the story, poll or job. HTML.
    parts: HackerNewsItemId[], // A list of related pollopts, in display order.
    descendants: number | null, // In the case of stories or polls, the total comment count.
}

export interface HackerNewsUser {
    id: HackerNewsUserId, // The user's unique username. Case-sensitive. Required.
    delay: number, // Delay in minutes between a comment's creation and its visibility to other users.
    created: number, // Creation date of the user, in Unix Time.
    karma: number, // The user's karma.
    about: string, // The user's optional self-description. HTML.
    submitted: number, // List of the user's stories, polls and comments.
}

export default abstract class HackerNews {
    public static readonly TYPES: HackerNewsStoryType[] = Object.values(HackerNewsStoryTypes);
    public static readonly TYPE_TOP: HackerNewsStoryType = HackerNewsStoryTypes.top;
    public static readonly TYPE_NEW: HackerNewsStoryType = HackerNewsStoryTypes.new;
    public static readonly TYPE_BEST: HackerNewsStoryType = HackerNewsStoryTypes.best;
    public static readonly TYPE_ASK: HackerNewsStoryType = HackerNewsStoryTypes.ask;
    public static readonly TYPE_SHOW: HackerNewsStoryType = HackerNewsStoryTypes.show;
    public static readonly TYPE_JOB: HackerNewsStoryType = HackerNewsStoryTypes.job;

    /**
     * Get item by item ID
     * @param item ID of item. If item doesn't exist, null is returned.
     */
    public static getItem(item: HackerNewsItemId): Promise<HackerNewsItem | null> {
        return fetch(`${apiUrl}/item/${item}.json`)
            .then(res => res.json())
            .then(resjson => resjson as HackerNewsItem);
    }

    /**
     * Get user by user ID
     * @param item ID of user. If user doesn't exist, null is returned.
     */
    public static getUser(userId: HackerNewsUserId): Promise<HackerNewsUser | null> {
        return fetch(`${apiUrl}/user/${userId}.json`)
            .then(res => res.json())
            .then(resjson => resjson as HackerNewsUser);
    }

    /**
     * Get ID of the latest item posted on HN
     * @returns ID of the newst item
     */
    public static getMaxItemId(): Promise<HackerNewsItemId> {
        return fetch(`${apiUrl}/maxitem.json`)
            .then(res => res.json())
            .then(resjson => resjson as HackerNewsItemId);
    };

    /**
     * Get the latest item posted on HN
     * @returns Latest item posted on HN
     */
    public static getMaxItem(): Promise<HackerNewsItem> {
        return this.getMaxItemId().then(itemId => this.getItem(itemId) as unknown as HackerNewsItem); // Assume that this item exists
    }

    /**
     * Get IDs of new stories
     * @returns Array of IDs up to 500 new stories
     */
    public static getNewStoryIDs(): Promise<HackerNewsItemId[]> {
        return this.getStoryIds(this.TYPE_NEW);
    };

    /**
     * Get IDs of top stories
     * @returns Array of IDs up to 500 top stories
     */
    public static getTopStoryIDs(): Promise<HackerNewsItemId[]> {
        return this.getStoryIds(this.TYPE_TOP);
    };

    /**
     * Get IDs of best stories
     * @returns Array of IDs up to 500 best stories
     */
    public static getBestStoryIDs(): Promise<HackerNewsItemId[]> {
        return this.getStoryIds(this.TYPE_BEST);
    };

    /**
     * Get IDs of "Ask HN" stories
     * @returns Array of IDs up to 200 newest Ask HN stories
     */
    public static getAskStories(): Promise<HackerNewsItemId[]> {
        return this.getStoryIds(this.TYPE_ASK);
    };

    /**
     * Get IDs of "Show HN" stories
     * @returns Array of IDs up to 200 newest Show HN stories
     */
    public static getShowStories(): Promise<HackerNewsItemId[]> {
        return this.getStoryIds(this.TYPE_SHOW);
    };

    /**
     * Get IDs of "Job" stories
     * @returns Array of IDs up to 200 newest Job stories
     */
    public static getJobStories(): Promise<HackerNewsItemId[]> {
        return this.getStoryIds(this.TYPE_JOB);
    };

    /**
     * Get IDs of recently updated items and stories
     * @returns object with 2 arrays, one with updared story IDs, one with updated user IDs
     */
    public static getUpdates(): Promise<{ items: HackerNewsItemId[], profiles: HackerNewsUserId[]; }> {
        return fetch(`${apiUrl}/updates.json`)
            .then(res => res.json())
            .then(resjson => resjson as { items: HackerNewsItemId[], profiles: HackerNewsUserId[]; });
    };

    /**
     * Get IDs of HN stories
     * @param type Any of "top" | "new" | "best" | "ask" | "show" | "job"
     * @returns Array of IDs
     */
    public static getStoryIds(type: HackerNewsStoryType): Promise<HackerNewsItemId[]> {
        return fetch(`${apiUrl}/${type}stories.json`)
            .then(res => res.json())
            .then(resjson => resjson as HackerNewsItemId[]);
    }

    /**
     * Get stories for a given category, includes options for pagination
     * If offset higher than the amount of retrievable stories, an empty array will be returned
     * @param type Any of "top" | "new" | "best" | "ask" | "show" | "job"
     * @param offset Offset, with 0 being the newest story
     * @param amount Amount of stories to retrieve
     */
    public static getStories(type: HackerNewsStoryType, offset: number = 0, amount: number = 0): Promise<HackerNewsItem[]> {
        return this.getStoryIds(type)
            .then((storyIds: number[]) => {
                if (amount) storyIds = storyIds.slice(Math.min(offset, storyIds.length - 1), Math.min(offset + amount, storyIds.length - 1));
                return Promise.all(storyIds.map(storyId => this.getItem(storyId) as unknown as HackerNewsItem));
            });
    }
}