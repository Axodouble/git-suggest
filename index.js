// @ts-check
const { Client, GatewayIntentBits, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, ChannelType, ButtonStyle, ButtonBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const settings = require('./settings');

if (!process.env.DISCORD_TOKEN) {
    console.error('No DISCORD_TOKEN provided');
    process.exit(1);
}

if (!process.env.GITHUB_TOKEN) {
    console.error('No GITHUB_TOKEN provided');
    process.exit(1);
}

if (!process.env.GITHUB_OWNER) {
    console.error('No GITHUB_OWNER provided');
    process.exit(1);
}

if (!process.env.GITHUB_REPO) {
    console.error('No GITHUB_REPO provided');
    process.exit(1);
}

client.once('ready', async () => {
    // @ts-ignore
    console.log(`Logged in as ${client.user.tag}!`);
    // @ts-ignore
    client.application.commands.create(new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Show the panel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
    )
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
    if(!interaction.guild) return;
    if (interaction.isCommand()) {
        if (interaction.commandName === 'panel') {
            // @ts-ignore as the options are not on the command type for whatever reason
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
                    // @ts-ignore already guaranteed to be a string
                    owner: process.env.GITHUB_OWNER,
                    // @ts-ignore already guaranteed to be a string
                    repo: process.env.GITHUB_REPO,
                    body: interaction.fields.getTextInputValue('description'),
                    title: interaction.fields.getTextInputValue('title'),
                    labels: [interaction.customId]
                });

                if (settings.discord.enabled) {
                    // @ts-ignore as the guild is guaranteed to be a guild
                    const channel = await client.guilds.cache.get(interaction.guildId).channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.name === settings.discord.channel);
                    if (channel) {

                        let channelMessage = { content: settings.discord.message.content.replace('$link', data.html_url) };
                        settings.discord.message.embeds.forEach(embed => {
                            channelMessage.embeds = channelMessage.embeds || [];

                            channelMessage.embeds.push({
                                title: embed.title.replace('$title', interaction.fields.getTextInputValue('title')),
                                description: embed.description.replace('$description', interaction.fields.getTextInputValue('description')),
                                // @ts-ignore as the type is applicable
                                thumbnail: embed.thumbnail.replace('$userAvatar', interaction.user.avatarURL()),
                                color: embed.color
                            });
                        })

                        // @ts-ignore as the channel is guaranteed to be a text channel
                        const message = await channel.send(channelMessage);

                        if (settings.discord.voting) {
                            await message.react('👍');
                            await message.react('👎');
                        }

                        if (settings.discord.thread) {
                            await message.startThread({
                                name: interaction.fields.getTextInputValue('title'),
                                autoArchiveDuration: 1440
                            });
                        }
                    }
                }


                await interaction.reply({content:`Suggestion created succesfully: ${data.html_url}`,ephemeral: false});
            } catch (error) {
                console.error(error.stack);
                await interaction.reply({ content: `An unexpected error occurred: ${error.message}`, ephemeral: false });
            }
        }
    }
});

function showSuggestionsModal(interaction) {
    const category = settings.categories.find(category => category.github.label === interaction.customId);
    if (!category) {
        interaction.message.update(message);
        return interaction.reply("Invalid category...");
    }
    interaction.showModal(
        new ModalBuilder()
            .setTitle(category.button.label)
            .setCustomId(category.github.label)
            // @ts-ignore as the types here are correct however not supported according to the types
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

client.login(process.env.DISCORD_TOKEN);
