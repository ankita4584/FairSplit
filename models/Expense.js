const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
    name: String,
    share_type: { type: String, enum: ["percentage", "exact", "equal"], default: "equal" },
    share_value: Number
});

const expenseSchema = new mongoose.Schema({
    description: String,
    amount: { type: Number, required: true },
    paid_by: String,
    split_between: [participantSchema],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Expense", expenseSchema);
