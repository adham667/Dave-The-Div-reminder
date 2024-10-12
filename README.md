# Codeforces Division Reminder Discord Bot

This Discord bot reminds users about upcoming Codeforces contests, specifically divisions, by sending messages in a designated channel the day before a contest. The bot fetches contest data from the Codeforces API and schedules reminders for future contests.

## Features

- Fetches upcoming contests from the Codeforces API.
- Sends reminders about upcoming contests one day before they start.
- Uses Discord.js for interaction with the Discord server.
- Hosted using GitHub Actions for scheduled runs.

## File Structure

```
.
├── .github/
│   └── workflows/         # Contains GitHub Actions workflow files for automating the bot
├── .gitignore             # Specifies files and directories to be ignored by Git
├── index.mjs              # Main bot code
├── package-lock.json      # Automatically generated for package versions
├── package.json           # Project metadata and dependencies
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add your Discord bot token:

```
TOKEN=your-discord-bot-token
```

### 4. Set up the Bot

- Ensure your bot has the necessary permissions to read messages and send reminders in the appropriate channel.
- Update the channel name in the `scheduleReminders` function (in `index.mjs`) with the name or ID of the channel where you want reminders to be sent:

```js
const channel = client.channels.cache.find(channel => channel.name === 'div-reminders');
```

### 5. Run the Bot Locally

```bash
node index.mjs
```

### 6. Hosting with GitHub Actions

The bot is configured to run using GitHub Actions, which allows it to run at specific intervals without needing to be hosted on a server 24/7.

1. Commit and push your changes to GitHub.
2. GitHub Actions will automatically trigger based on the workflow file in `.github/workflows/`.

## Contributing

Feel free to fork the repository and submit pull requests if you have suggestions or improvements.

## License

This project is licensed under the MIT License.

---

Let me know if you'd like any changes or if there are any other specific details you'd like to add!
