const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const MoodEntry = require("./models/MoodEntry");
require("dotenv").config({ path: "./.env" });

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/unilife-os");
        
        // Find a user
        const user = await User.findOne({});
        if(!user) {
            console.log("No user found in DB");
            process.exit(1);
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        // Make an HTTP Request to local server
        const payload = { mood: "happy", note: "Testing from script" };
        const response = await fetch("http://localhost:5000/api/moods", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", data);

        // Verify DB
        const entries = await MoodEntry.find({ student: user._id });
        console.log("Entries in DB after save:", entries.length);
        console.log("Latest entry:", entries[entries.length-1]);
        
        process.exit(0);

    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
runTest();
