const { Client, GatewayIntentBits, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, ChannelType, ButtonStyle, ButtonBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const settings = require('./settings');

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.application.

        client.application.commands.create(new SlashCommandBuilder()
            .setName('suggest')
            .setDescription('Suggest a feature')
        );
    client.application.commands.create(new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Show the panel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addChannelOption(option =>
            option
                .addChannelTypes(ChannelType.GuildText)
                .setName('channel')
                .setDescription('The channel to show the panel in')
                .setRequired(false)
        ))
});

// Construct panel message
let message = { content: settings.panel.content }
settings.panel.embeds.forEach(embed => {
    message.embeds = message.embeds || [];
    let fields = [];
    embed.fields.forEach(field => {
        field.inline = field.inline || false;
        field.name = field.name || 'Field';
        field.value = field.value || 'Value';
    })

    message.embeds.push({
        title: embed.title,
        description: embed.description,
        color: embed.color,
        fields: fields
    });
})

let buttons = []

settings.categories.forEach(category => {
    message.components = message.components || [];

    let buttonStyle = ButtonStyle.Secondary;
    if (category.button.style === 'primary') {
        buttonStyle = ButtonStyle.Primary;
    } else if (category.button.style === 'success') {
        buttonStyle = ButtonStyle.Success;
    } else if (category.button.style === 'danger') {
        buttonStyle = ButtonStyle.Danger;
    }
    if (buttons.length === 5) {
        message.components.push(new ActionRowBuilder().setComponents(buttons));
        buttons = [];
    }

    buttons.push(new ButtonBuilder()
        .setLabel(category.button.label)
        .setStyle(buttonStyle)
        .setCustomId(category.github.label))
})
message.components.push(new ActionRowBuilder().setComponents(buttons));


client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        if (interaction.commandName === 'suggest') {
            showSuggestionsModalOld(interaction);
        } else if (interaction.commandName === 'panel') {
            const channel = interaction.options.getChannel('channel') || interaction.channel;
            await channel.send(message);

        }
    }
    if (interaction.isButton()) {
        showSuggestionsModal(interaction);

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
    const category = settings.categories.find(category => category.github.label === interaction.customId);
    interaction.showModal(
        new ModalBuilder()
            .setTitle(category.button.label)
            .setCustomId(category.github.label)
            .setComponents([
                new ActionRowBuilder().setComponents([
                    new TextInputBuilder()
                        .setLabel(category.title.label)
                        .setPlaceholder(category.title.placeholder)
                        .setCustomId("title")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short),
                ]),
                new ActionRowBuilder().setComponents([
                    new TextInputBuilder()
                        .setLabel(category.description.label)
                        .setPlaceholder(category.description.placeholder)
                        .setCustomId("description")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(10)
                        .setMaxLength(2000),
                ]),
            ])
    )
}

function showSuggestionsModalOld(interaction) {
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
