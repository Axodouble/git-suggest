module.exports = {
    discord: {
        enabled: true, // Send a copy to a Discord channel when something is submitted
        voting: true, // Voting adds a thumbs up and thumbs down reaction to the message
        thread: true, // Create a thread in the Discord channel
        channel: "suggestions", // The channel to send the message to
        message: {
            title: null, // The title of the message
            content: "A new suggestion has been submitted.\n-# [Link]($link)", // The content of the message
            embeds: [
                {
                    title: "$title", // The title of the embed
                    description: "$description", // The description of the embed
                    thumbnail: "$userAvatar", // The thumbnail of the embed
                    color: 0xffffff // The color of the embed
                }
            ]
        },
    },
    panel: {
        content: null, // The content of the message
        embeds: [
            {
                title: "Suggestions, bugs, and feedback", // The title of the embed
                description: "Submit suggestions, bug reports or feedback using the buttons below.", // The description of the embed
                color: 0xffffff, // The color of the embed
                fields: [
                    {
                        name: "Don't open questions.", // The name of the field
                        value: "Try to keep your suggestions and bug reports clear and concise. If you have a question, please ask in the support server.", // The value of the field
                        inline: false // Whether the field is inline or not
                    }
                ]
            }
        ]
    },
    categories: [
        {
            github: {
                label: "suggestion" // The label used for the issue on GitHub
            },
            button: {
                label: "Suggestion", // The text displayed on the button
                style: "secondary" // The style of the button (primary, secondary, success, danger)
            },
            title: {
                label: "Suggestion Title", // The label for the input field
                placeholder: "Enter the title of the suggestion" // The placeholder text for the input field
            },
            description: {
                label: "Suggestion Description", // The label for the input field
                placeholder: "Enter the description of the suggestion" // The placeholder text for the input field
            }
        },
        {
            github: {
                label: "bug" // The label used for the issue on GitHub
            },
            button: {
                label: "Bug Report", // The text displayed on the button
                style: "secondary" // The style of the button (primary, secondary, success, danger)
            },
            title: {
                label: "Bug Report Title", // The label for the input field
                placeholder: "Enter the title of the bug report" // The placeholder text for the input field
            },
            description: {
                label: "Bug Report Description", // The label for the input field
                placeholder: "Enter the clear & concise description of the bug report" // The placeholder text for the input field
            }
        }
    ]
}