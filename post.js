'use strict';

require('dotenv').config();

const axios = require('axios');

const Promise = require('bluebird');

const {
	apiEndpoint,
	token,
	channelName
} = process.env;

module.exports = (id, hrefs, text) => {
    const media = hrefs.map((href) => {
        return {
            type: 'photo',
            media: href
        }
    });

    const promises = [];

    if (typeof text === 'string' && text.length) {
        media[0].caption = text;
    }

    return axios({
        method: 'post',
        url: `${apiEndpoint}/bot${token}/sendMediaGroup?chat_id=@${channelName}`,
        data: `media=${JSON.stringify(media)}`,
        config: {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    })
    .then(() => {
        console.log(`Successfully sent post ${id}`);
    })
    .catch((err) => {
        console.log(`Failed to send post attachments ${id}`);
        console.dir(err);
    });

    return Promise.all(promises);
}
