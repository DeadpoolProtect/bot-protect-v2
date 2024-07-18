const VoiceTimeSchema = require('../../Schema/VoiceTimeSchema');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const { guild, member } = newState;
    
    if (member.user.bot) {
      return;
    }

    const { id: guildId } = guild;
    const { id: userId } = member;

    let voiceTimeData = await VoiceTimeSchema.findOne({ guildId, userId });

    if (!voiceTimeData) {
      voiceTimeData = await VoiceTimeSchema.create({ guildId, userId, lastJoinTime: Date.now() });
    }

    const currentTime = Date.now();

    if (oldState.channelId !== newState.channelId) {
      if (oldState.channelId) {
        voiceTimeData.timeInVoice += currentTime - voiceTimeData.lastJoinTime;
      }

      if (newState.channelId) {
        voiceTimeData.lastJoinTime = currentTime;
      }

      await voiceTimeData.save();
    }
  },
};
