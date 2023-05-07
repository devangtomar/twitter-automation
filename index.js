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
