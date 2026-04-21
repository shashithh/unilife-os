const mongoose = require("mongoose");
const MoodEntry = require("./backend/models/MoodEntry");
require("dotenv").config({ path: "./backend/.env" });

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/unilife-os")
  .then(async () => {
    const entries = await MoodEntry.find({});
    console.log("Mood entries:", entries.length);
    console.log("Samples:", entries.slice(0, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
