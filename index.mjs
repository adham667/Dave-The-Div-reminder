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

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Fetch contests and wait for reminders to be scheduled
  await fetchContests();
  
  console.log("All reminders scheduled. Exiting process...");
  process.exit(0);  // Exit once all reminders are scheduled
});

async function fetchContests() {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const contests = response.data.result;
    
    const currentDate = new Date();

    // Array to store promises for reminder scheduling
    const reminderPromises = contests
      .filter(contest => new Date(contest.startTimeSeconds * 1000) > currentDate)  // Only future contests
      .map(contest => {
        const startDate = new Date(contest.startTimeSeconds * 1000 + 2*60*60*1000); // Convert to milliseconds
        return scheduleReminders(contest, startDate); // Schedule and return a promise
      });

    // Wait for all reminders to be scheduled
    await Promise.all(reminderPromises);

  } catch (error) {
    console.error("Error fetching contests:", error);
  }
}

function scheduleReminders(contest, startDate) {
  return new Promise(async (resolve, reject) => {
    try {
      const contestName = contest.name;
      const channel = client.channels.cache.find(channel => channel.name === 'div-reminders'); // Replace with your channel name or ID
      
      const currentDate = new Date();
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + 1); // Set for tomorrow
      
      const isTomorrow = startDate.toDateString() === tomorrow.toDateString();

      if (isTomorrow && channel) {
        // Send reminder if the contest is tomorrow
        const adjustedStartDate = new Date(startDate.getTime() + 1 * 60 * 60 * 1000);
        await channel.send(`@everyone Reminder: ${contestName} starts tomorrow at ${adjustedStartDate.toLocaleString()}`);
      }
      
      resolve();  // Resolve the promise once the reminder is sent
    } catch (error) {
      console.error("Error scheduling reminder:", error);
      reject(error);  // Reject the promise if there is an error
    }
  });
}

client.on("messageCreate", async (message) => {
  if (!message.author.bot) {
    // Additional bot functionality can be added here
  }
});
