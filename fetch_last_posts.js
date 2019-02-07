#!/usr/bin/env node

'use strict';

require('dotenv').config();

const fs = require('fs');
const axios = require('axios');
const Promise = require('bluebird');

const post = require('./post');

const knownPosts = require('./known_posts.json');

const {
    wallId,
    channelName,
    accessToken,
    postsCount,
    fetchInterval
} = process.env;

setInterval(() => {
    axios({
        method: 'get',
        url: `https://api.vk.com/method/wall.get?owner_id=${wallId}&access_token=${accessToken}&count=${postsCount}&filter=owner&v=5.92`
    })
        .then((response) => {
            const {items} = response.data.response;

            const queue = items.reverse().map((item) => {
                const {id, text} = item;

                let {attachments} = item;
                if (!attachments && item.copy_history) {
                    attachments = item.copy_history[0].attachments;
                }

                if (knownPosts.indexOf(id) === -1) {
                    knownPosts.push(id);

                    const hrefs = attachments.map((attach) => {
                        if (attach.type === 'photo') {
                            const {sizes} = attach.photo;

                            const maxWidth = Math.max.apply(null, sizes.map((size) => size.width));
                            const photo = sizes.find((size) => size.width === maxWidth);

                            if (photo) {
                                return photo.url;
                            } else {
                                console.log(`Invalid attach photo in post ${id}`);

                                return null;
                            }
                        }
                    }).filter((href) => typeof href === 'string');

                    return [id, hrefs, text];
                } else {
                    return null;
                }
            }).filter((args) => args !== null);

            Promise.map(queue, function(args) {
                return post.apply(null, args);
            }).then(() => {
                console.log('Done!');
                fs.writeFile('known_posts.json', JSON.stringify(knownPosts));
            });
        })
        .catch(function (response) {
            console.log('Failed to fetch posts');
            console.dir(response);
        });
}, Number(fetchInterval)*60*1000);
