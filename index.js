require('dotenv').config();
const lineSDK = require('@line/bot-sdk');
const Twit = require('twit');
const moment = require('moment');

const line = new lineSDK.Client({
  channelAccessToken: process.env.LINETOKEN,
});

const userIds = ['1130446271611727874'];

const twit = new Twit({
  consumer_key: process.env.CONSUMERKEY,
  consumer_secret: process.env.CONSUMERSECRET,
  access_token: process.env.ACCESSTOKEN,
  access_token_secret: process.env.ACCESSTOKENSECRET,
});

const stream = twit.stream('statuses/filter', { follow: userIds });

const pushTweet = (payload) => {
	const contents = [
		{
			"type": "box",
			"layout": "horizontal",
			"contents": [
				{
					"type": "box",
					"layout": "vertical",
					"contents": [
						{
							"type": "image",
							"url": payload.user.profile_image_url_https,
							"aspectMode": "cover",
							"size": "full"
						}
					],
					"cornerRadius": "100px",
					"width": "50px",
					"height": "50px"
				},
				{
					"type": "box",
					"layout": "vertical",
					"contents": [
						{
							"type": "text",
							"contents": [
								{
									"type": "span",
									"text": `@${payload.user.screen_name}`,
									"weight": "bold",
									"color": "#000000"
								}
							],
							"size": "sm",
							"wrap": true
						},
						{
							"type": "text",
							"contents": [
								{
									"type": "span",
									"text": payload.text
								}
							],
							"size": "sm",
							"wrap": true
						},
						{
							"type": "box",
							"layout": "baseline",
							"contents": [
								{
									"type": "text",
									"wrap": true,
									"text": moment(payload.created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').utcOffset(7).format('LLLL'),
									"size": "sm",
									"color": "#bcbcbc"
								}
							],
							"spacing": "sm",
							"margin": "md"
						}
					]
				}
			],
			"spacing": "xl",
			"paddingAll": "20px"
		}
	];

	if (payload.extended_entities && payload.extended_entities.media) {
		const medias = {
			"type": "box",
			"layout": "horizontal",
			"contents": []
		};
		payload.extended_entities.media.map(each => {
			medias.contents.push({
				"type": "image",
				"url": each.media_url_https,
				"size": "5xl",
				"aspectMode": "cover",
				"gravity": "center",
				"flex": 1
			})
		});
		contents.unshift(medias);
	}

	line.pushMessage('C81c6494d0531e3c8e5b350fc0ba5a3ce', {
		"type": "flex",
		"altText": "Cuitan baru dari Alma!",
		"contents": {
			"type": "bubble",
			"body": {
				"type": "box",
				"layout": "vertical",
				"contents": contents,
				"paddingAll": "0px"
			},
			"footer": {
				"type": "box",
				"layout": "vertical",
				"spacing": "sm",
				"contents": [
					{
						"type": "button",
						"style": "primary",
						"color": "#1DA1F2",
						"action": {
							"type": "uri",
							"label": "Lihat Cuitan",
							"uri": "https://twitter.com/A_AlmaJKT48/status/1201441196461051905"
						}
					}
				]
			}
		}
	});
};

stream.on('tweet', function (tweet) {
	if (userIds.includes(tweet.user.id_str)) pushTweet(tweet);
});

