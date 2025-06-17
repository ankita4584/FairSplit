const Expense = require("../models/Expense");
const { calculateSettlement } = require("../utils/settlementCalculator");

exports.addExpense = async (req, res) => {
    try {
        const { amount, description, paid_by, split_between } = req.body;
        if (!amount || !paid_by || !split_between || split_between.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const expense = new Expense({ amount, description, paid_by, split_between });
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!expense) return res.status(404).json({ error: "Expense not found" });
        res.status(200).json(expense);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ error: "Expense not found" });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getSettlement = async (req, res) => {
    try {
        const expenses = await Expense.find();
        const summary = calculateSettlement(expenses);
        res.status(200).json(summary);
    } catch (err) {
        res.status(500).json({ error: "Error calculating settlements" });
    }
};
