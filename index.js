const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.application.commands.create(new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest a feature or report a bug')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the GitHub issue')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Detailed description of the issue')
                .setRequired(true))
    )
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'suggest') {
        try {
            // Create a GitHub issue
            const { data } = await octokit.issues.create({
                owner: process.env.GITHUB_OWNER,
                repo: process.env.GITHUB_REPO,
                title: interaction.options.getString('title'),
                body: interaction.options.getString('description'),
            });

            await interaction.reply(`GitHub issue created successfully: ${data.html_url}`);
        } catch (error) {
            console.error(error.stack);
            await interaction.reply('There was an error creating the GitHub issue.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
