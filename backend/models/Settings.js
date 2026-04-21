const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    monthlyBudget: {
      type: Number,
      required: true,
      default: 50000
    },
    warningThreshold: {
      type: Number,
      required: true,
      default: 80
    },
    strictMode: {
      type: Boolean,
      default: false
    },
    categoryBudgets: {
      type: Map,
      of: Number,
      default: {}
    },
    muteAllAlerts: {
      type: Boolean,
      default: false
    },
    enableEmailAlerts: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);