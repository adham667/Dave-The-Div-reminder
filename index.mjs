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

// To keep track of scheduled contests
const scheduledContests = new Set();

client.login(process.env.TOKEN);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
//   Fetch contests every hour
  setInterval(fetchContests, 3600000);
    // fetchContests()
});

async function fetchContests() {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const contests = response.data.result;

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
//   console.log(channel);
  
  // Check if reminders for this contest are already scheduled
  if (!scheduledContests.has(contestId)) {
    scheduledContests.add(contestId); // Mark this contest as scheduled

    // Reminder 1: 1 day before
    const oneDayBefore = new Date(startDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    const timeUntilOneDay = oneDayBefore - new Date();

    // console.log(oneDayBefore, timeUntilOneDay);


    // Check if the contest is today for testing
    // const currentDate = new Date();
    // const tomorrow = new Date(currentDate);
    // tomorrow.setDate(tomorrow.getDate() + 1);
    
    // const isTomorrow = startDate.toDateString() === tomorrow.toDateString();
    
    // if (isTomorrow) {
    //   // Send immediate reminder if the contest is tomorrow
    //   channel.send(`@everyone Reminder: ${contestName} starts tomorrow at ${startDate.toLocaleString()}`);
    // }

    if (timeUntilOneDay > 0) {
      setTimeout(() => {
        channel.send(`@everyone Reminder: ${contestName} starts in 1 day at ${startDate.toLocaleString()}`);
      }, timeUntilOneDay);
    }

    // Reminder 2: 2 hours before
    const twoHoursBefore = new Date(startDate);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
    const timeUntilTwoHours = twoHoursBefore - new Date();

    if (timeUntilTwoHours > 0) {
      setTimeout(() => {
        channel.send(`@everyone Reminder: ${contestName} starts in 2 hours at ${startDate.toLocaleString()}`);
      }, timeUntilTwoHours);
    }
  }
}

client.on("messageCreate", async (message) => {
  if (!message.author.bot) {
    // Additional bot functionality can be added here
  }
});
