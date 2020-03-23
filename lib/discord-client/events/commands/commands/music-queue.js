'use strict';

const _ = require('lodash');
const Discord = require('discord.js');

module.exports = {
  name: 'queue',
  description: 'Lists the current queue.',
  requiredChannelPermissions: ['SEND_MESSAGES'],
  async execute({message, args}) {
    if (!message.member.voice.channel) {
      return await message
          .reply('You have to be in a voice channel to stop the music!');
    }
    const serverQueue = _.invoke(message,
        'client.musicQueue.get', message.guild.id);
    if (serverQueue) {
      const songs = serverQueue.songs || [];
      if (_.isEmpty(songs)) {
        return await message
            .reply('The queue is empty.');
      } else {
        const nowPlaying = _.first(songs);
        const queuedSongs = songs.slice(1, serverQueue.songs.length);
        const embed = new Discord.MessageEmbed();
        embed.setColor('LUMINOUS_VIVID_PINK');
        embed.setAuthor(nowPlaying.author.name,
            nowPlaying.author.avatar,
            nowPlaying.author.channel_url || nowPlaying.author.user_url);
        embed.setTitle(`:musical_note: Now playing :musical_note:`);
        embed.setDescription(nowPlaying.title);
        embed.setURL(nowPlaying.video_url);
        embed.setThumbnail(`https://img.youtube.com/vi/${nowPlaying.video_id}/0.jpg`);
        // Show queue
        if (!_.isEmpty(queuedSongs)) {
          embed.addField('Queued songs',
              _.map(queuedSongs, (song, index) => {
                return `${index+1}. [${song.title}](${song.video_url})`;
              }).join('\n'),
              true);
        }
        await message.channel.send(embed);
      }
    } else {
      return await message.reply('I\'m not playing anything at the moment.');
    }
  },
};