module.exports = {
    panel: {
        content: null,
        embeds: [
            {
                title: "Suggestion",
                description: "Submit a suggestion",
                color: 0xffffff,
                fields: []
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