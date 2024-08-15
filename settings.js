module.exports = {
    panel: {
        content: null,
        embeds: [
            {
                title: "Suggestions, bugs, and feedback",
                description: "Submit suggestions, bug reports or feedback using the buttons below.",
                color: 0xffffff,
                fields: [
                    {
                        name: "Don't open questions.",
                        value: "Try to keep your suggestions and bug reports clear and concise. If you have a question, please ask in the support server.",
                        inline: false
                    }
                ]
            }
        ]
    },
    categories: [
        {
            github: {
                label: "suggestion"
            },
            button: {
                label: "Suggestion",
                style: "secondary"
            },
            title: {
                label: "Suggestion Title",
                placeholder: "Enter the title of the suggestion"
            },
            description: {
                label: "Suggestion Description",
                placeholder: "Enter the description of the suggestion"
            }
        },
        {
            github: {
                label: "bug"
            },
            button: {
                label: "Bug Report",
                style: "secondary"
            },
            title: {
                label: "Bug Report Title",
                placeholder: "Enter the title of the bug report"
            },
            description: {
                label: "Bug Report Description",
                placeholder: "Enter the clear & concise description of the bug report"
            }
        }
    ]
}