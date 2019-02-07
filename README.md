# vk_to_telegram_autopost_bot
Bot for autoposting from vk community to telegram channel

# How to use
1). Add `.env` file with settings:

```
token=<telegram bot token>
channelName=<channel name without @>
apiEndpoint=https://api.telegram.org
wallId=<wall id (not that wall id has "-" prefix)>
accessToken=<vk api access token>
postsCount=<how much posts to fetch in every fetch>
fetchInterval=<number of minutes before next fetch>
```

2). Add empty ignore list file `known_posts.json`:

```
[]
```

3). Use process manager (like `pm2`) to start bot as daemon (`pm2 start fetch_last_posts`)
