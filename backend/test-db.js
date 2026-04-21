const mongoose = require("mongoose");
const MoodEntry = require("./models/MoodEntry");
require("dotenv").config({ path: "./.env" });

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/unilife-os")
  .then(async () => {
    const entries = await MoodEntry.find({});
    console.log("Total entries:", entries.length);
    console.log("Sample:", entries[0]);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
