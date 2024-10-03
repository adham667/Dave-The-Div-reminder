import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});



client.login(process.env.TOKEN);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
//   Fetch contests every hour
//   setInterval(fetchContests, 3600000);
    fetchContests()  
});

async function fetchContests() {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const contests = response.data.result;
    //console.log(contests);
    
    const currentDate = new Date();

    contests.forEach(contest => {
      const startDate = new Date(contest.startTimeSeconds * 1000); // Convert to milliseconds

      // Check if the contest is upcoming
      if (startDate > currentDate) {
        scheduleReminders(contest, startDate);
      }
    });

  } catch (error) {
    console.error("Error fetching contests:", error);
  }
}

function scheduleReminders(contest, startDate) {
  const contestId = contest.id; // Use contest ID to track scheduled reminders
  const contestName = contest.name;
  const channel = client.channels.cache.find(channel => channel.name === 'div-reminders'); // Replace with your channel ID

    // Check if the contest is tommorow
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isTomorrow = startDate.toDateString() === tomorrow.toDateString();
    
    if (isTomorrow) {
      // Send immediate reminder if the contest is tomorrow
      channel.send(`@everyone Reminder: ${contestName} starts tomorrow at ${startDate.toLocaleString()}`);
    }
}

client.on("messageCreate", async (message) => {
  if (!message.author.bot) {
    // Additional bot functionality can be added here
  }
});
