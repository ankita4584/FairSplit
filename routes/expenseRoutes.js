const express = require("express");
const router = express.Router();
const {
    addExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense,
    getSettlement
} = require("../controllers/expenseController");

router.post("/", addExpense);
router.get("/", getAllExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/settlement/summary", getSettlement);

module.exports = router;
