function calculateSettlement(expenses) {
    const balances = {};

    expenses.forEach(exp => {
        const amount = exp.amount;
        const payer = exp.paid_by;
        const split = exp.split_between;

        if (!balances[payer]) balances[payer] = 0;
        balances[payer] += amount;

        let totalSplit = 0;
        split.forEach(p => {
            if (p.share_type === 'equal') totalSplit += 1;
        });

        const perShare = amount / totalSplit;

        split.forEach(p => {
            if (!balances[p.name]) balances[p.name] = 0;
            if (p.share_type === 'equal') {
                balances[p.name] -= perShare;
            }
        });
    });

    return simplifyDebts(balances);
}

function simplifyDebts(balances) {
    const people = Object.entries(balances).map(([name, balance]) => ({ name, balance }));
    const debtors = people.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = people.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);

    const settlements = [];

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(-debtor.balance, creditor.balance);

        if (amount > 0) {
            settlements.push({
                from: debtor.name,
                to: creditor.name,
                amount: parseFloat(amount.toFixed(2))
            });

            debtor.balance += amount;
            creditor.balance -= amount;
        }

        if (Math.abs(debtor.balance) < 1e-6) i++;
        if (Math.abs(creditor.balance) < 1e-6) j++;
    }

    return settlements;
}

module.exports = { calculateSettlement };
