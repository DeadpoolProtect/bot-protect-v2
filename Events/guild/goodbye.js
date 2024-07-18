const { AttachmentBuilder } = require(`discord.js`);
const Canvas = require(`canvas`);
const goodbyeSchema = require(`../../Schema/goodbyeSchema`);

module.exports = {
  name: "guildMemberRemove",

  async execute(member, client) {
    const data = await goodbyeSchema.findOne({
      guildid: member.guild.id,
    });

    if (!data) return;

    const goodbyeCanvas = {};
    goodbyeCanvas.create = Canvas.createCanvas(1024, 500);
    goodbyeCanvas.context = goodbyeCanvas.create.getContext("2d");
    goodbyeCanvas.context.font = "72px sans-serif";
    goodbyeCanvas.context.fillStyle = "#ffffff";

    await Canvas.loadImage(__dirname + `/bg.jpg`).then(async (img) => {
      goodbyeCanvas.context.drawImage(img, 0, 0, 1024, 500);
      goodbyeCanvas.context.fillText("Au revoir", 360, 360);
      goodbyeCanvas.context.beginPath();
      goodbyeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
      goodbyeCanvas.context.stroke();
      goodbyeCanvas.context.fill();
    });

    let canvas = goodbyeCanvas;
    canvas.context.font = "42px sans-serif";
    canvas.context.textAlign = "center";
    canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410);
    canvas.context.font = "32px sans-serif";
    canvas.context.fillText(
      `Il reste ${
        member.guild.memberCount
      } membre(s) sur le serveur`,
      512,
      455
    );
    canvas.context.beginPath();
    canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
    canvas.context.closePath();
    canvas.context.clip();
    await Canvas.loadImage(
      member.user.displayAvatarURL({ extension: "jpg", size: 1024 })
    ).then((img) => {
      canvas.context.drawImage(img, 393, 47, 238, 238);
    });

    const attachment = new AttachmentBuilder(
      await canvas.create.toBuffer(),
      {
        name: "goodbye.png",
      }
    );

    process.noDeprecation = true;

    member.guild.channels.cache.get(data.channel).send({
      content: data.message
        .replace(/\{mention\}/g, member.user.toString())
        .replace(/\{user\}/g, member.user.username)
        .replace(/\{servername\}/g, member.guild.name)
        .replace(/\{totalmembers\}/g, member.guild.memberCount),
      files: [attachment],
    });
  },
};
