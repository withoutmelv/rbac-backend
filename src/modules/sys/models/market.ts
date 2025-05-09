// models/Market.js
const mongoose = require("mongoose");

const AppSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    code: {type: String, required: true},
    description: { type: String },
    icon: {type: String},
    iconColor: {type: String},
});

export const App = mongoose.model("App", AppSchema);