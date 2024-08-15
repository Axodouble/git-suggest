const { Client, GatewayIntentBits, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.application.

        client.application.commands.create(new SlashCommandBuilder()
            .setName('suggest')
            .setDescription('Suggest a feature')
        );
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'suggest') {
            showSuggestionsModal(interaction);
        }
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'suggestion') {
            try {
                const { Octokit } = await import('@octokit/rest');
                const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
                const { data } = await octokit.issues.create({
                    owner: process.env.GITHUB_OWNER,
                    repo: process.env.GITHUB_REPO,
                    body: interaction.fields.getTextInputValue('description'),
                    title: interaction.fields.getTextInputValue('title'),
                    labels: ['suggestion']
                });

                await interaction.reply(`Suggestion created succesfully: ${data.html_url}`);
            } catch (error) {
                console.error(error.stack);
                await interaction.reply('There was an error creating the GitHub issue.');
            }
        }
    }
});

function showSuggestionsModal(interaction) {
    interaction.showModal(
        new ModalBuilder()
            .setTitle("Suggestions")
            .setCustomId("suggestion")
            .setComponents([
                new ActionRowBuilder().setComponents([
                    new TextInputBuilder()
                        .setLabel("Title")
                        .setPlaceholder("Enter the title of the suggestion")
                        .setCustomId("title")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short),
                ]),
                new ActionRowBuilder().setComponents([
                    new TextInputBuilder()
                        .setLabel("Description")
                        .setPlaceholder("Enter the description of the suggestion")
                        .setCustomId("description")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(10)
                        .setMaxLength(2000),
                ]),
            ])
    )
}

client.login(process.env.DISCORD_TOKEN);
