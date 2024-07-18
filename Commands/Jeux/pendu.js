const { SlashCommandBuilder } = require("discord.js");
const words = ["apple", "banana", "cherry", "date", "elderberry"]; // Liste des mots à deviner

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pendu")
        .setDescription("Commence un jeu du pendu."),
    async execute(interaction) {
        const word = words[Math.floor(Math.random() * words.length)].toLowerCase();
        let guessed = Array(word.length).fill("_");
        let attempts = 6;
        let guessedLetters = [];

        const message = await interaction.reply({
            content: `Jeu du pendu commencé !\nMot: \`${guessed.join(" ")}\`\nTentatives restantes: ${attempts}\nLettres devinées: ${guessedLetters.join(", ")}`,
            fetchReply: true
        });

        const filter = response => {
            return response.author.id === interaction.user.id && response.content.length === 1 && /[a-z]/i.test(response.content);
        };

        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', async response => {
            const letter = response.content.toLowerCase();
            if (guessedLetters.includes(letter)) {
                await response.reply(`:x: Vous avez déjà deviné la lettre \`${letter}\`. Essayez une autre lettre.`);
                return;
            }

            guessedLetters.push(letter);

            if (word.includes(letter)) {
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === letter) {
                        guessed[i] = letter;
                    }
                }

                if (guessed.join("") === word) {
                    collector.stop("gagné");
                }
            } else {
                attempts--;
                if (attempts === 0) {
                    collector.stop("perdu");
                }
            }

            await response.reply(`Mot: \`${guessed.join(" ")}\`\nTentatives restantes: ${attempts}\nLettres devinées: ${guessedLetters.join(", ")}`);
        });

        collector.on('end', (collected, reason) => {
            if (reason === "time") {
                interaction.followUp(`:alarm_clock: Temps écoulé ! Le mot était \`${word}\`.`);
            } else if (reason === "gagné") {
                interaction.followUp(`:tada: Félicitations ! Vous avez deviné le mot \`${word}\`.`);
            } else if (reason === "perdu") {
                interaction.followUp(`:x: Vous avez perdu ! Le mot était \`${word}\`.`);
            }
        });
    }
};
