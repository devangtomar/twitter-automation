const Twit = require('twit');

// Set up your Twitter API credentials
const T = new Twit({
    consumer_key: 'YOUR_CONSUMER_KEY',
    consumer_secret: 'YOUR_CONSUMER_SECRET',
    access_token: 'YOUR_ACCESS_TOKEN',
    access_token_secret: 'YOUR_ACCESS_TOKEN_SECRET',
});

// Fetch the user's followers
function getFollowers(screenName) {
    return new Promise((resolve, reject) => {
        T.get('followers/list', { screen_name: screenName }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const followers = data.users.map((user) => ({
                    id: user.id,
                    screen_name: user.screen_name,
                }));
                resolve(followers);
            }
        });
    });
}

// Fetch the user's friends (people they follow)
function getFriends(screenName) {
    return new Promise((resolve, reject) => {
        T.get('friends/list', { screen_name: screenName }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const friends = data.users.map((user) => ({
                    id: user.id,
                    screen_name: user.screen_name,
                }));
                resolve(friends);
            }
        });
    });
}

// Compare followers and friends to find users who don't follow back
async function getUsersNotFollowingBack(screenName) {
    try {
        const followers = await getFollowers(screenName);
        const friends = await getFriends(screenName);

        const usersNotFollowingBack = friends.filter(
            (friend) => !followers.some((follower) => follower.id === friend.id)
        );

        return usersNotFollowingBack;
    } catch (err) {
        throw new Error('Failed to fetch users.');
    }
}

// Unfollow a user by their ID
function unfollowUser(userId) {
    return new Promise((resolve, reject) => {
        T.post('friendships/destroy', { user_id: userId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Unfollow users who don't follow back
async function unfollowUsersNotFollowingBack(screenName) {
    try {
        const usersNotFollowingBack = await getUsersNotFollowingBack(screenName);

        for (const user of usersNotFollowingBack) {
            await unfollowUser(user.id);
            console.log(`Unfollowed ${user.screen_name}`);
        }

        console.log('Unfollow process completed.');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

// Usage
const myTwitterScreenName = 'YOUR_TWITTER_SCREEN_NAME';

unfollowUsersNotFollowingBack(myTwitterScreenName);
