document.addEventListener('DOMContentLoaded', function() {
    const EXPENSES = document.getElementById("expenses");
    const INCOME = document.getElementById('income');
    const BALANCE = document.getElementById('current-balance');
    const INCOME_BUTTON = document.getElementById('income-button');
    const EXPENSE_BUTTON = document.getElementById('expense-button');
    const INPUT_BLOCK = document.getElementById('input');
    const CANCEL_BUTTON = document.getElementById('cancel');
    const SUBMIT_BUTTON = document.getElementById('submit');
    const INPUT_AMOUNT = document.getElementById('amount');
    
    // Get initial values or set them to 0 if they don't exist
    const initialIncome = parseInt(localStorage.getItem('income')) || 0; 
    const initialExpenses = parseInt(localStorage.getItem('expenses')) || 0; 
    const initialBalance = initialIncome - initialExpenses;

    localStorage.setItem('income', initialIncome);
    localStorage.setItem('expenses', initialExpenses);
    localStorage.setItem('balance', initialBalance);
    
    showIncome();
    showExpense();
    showBalance();
    let isIncome;
    let transactionNumber = parseInt(localStorage.getItem('transactionNumber')) || 0;

    for (let i = 1; i <= transactionNumber; i++) {
        const transactionData = JSON.parse(localStorage.getItem(`transaction-${i}`));
        if (transactionData) {
            const { comment, amount, transactionType, time } = transactionData;
            addToTable(i, comment, amount, transactionType, time);
        }
    }
    
    INCOME_BUTTON.addEventListener('click', function() {
        INPUT_BLOCK.style.display = 'block';
        isIncome = true;
    });
    
    EXPENSE_BUTTON.addEventListener('click', function() {
        INPUT_BLOCK.style.display = 'block';
        isIncome = false;
    });
    
    CANCEL_BUTTON.addEventListener('click', function() {
        INPUT_BLOCK.style.display = 'none';
    });
    
    let transactionType = isIncome;
    SUBMIT_BUTTON.addEventListener('click', function() {
        let amountEntered = parseInt(INPUT_AMOUNT.value);
        if (isIncome) addToIncome(amountEntered);
        if (!isIncome) addToExpenses(amountEntered);
        INPUT_BLOCK.style.display = 'none';
        let comment = document.getElementById('comment').value;
        transactionNumber++;
        localStorage.setItem('transactionNumber', transactionNumber);
        const time = getCurrentDateTime();
        storeTransaction(transactionNumber, comment, amountEntered, transactionType, time);
        addToTable(transactionNumber, comment, amountEntered, transactionType, time);
        return;
    });

    function storeTransaction(transactionNumber, comment, amount, transactionType) {
        // Store the transaction data in localStorage
        localStorage.setItem(`transaction-${transactionNumber}`, JSON.stringify({
            comment,
            amount,
            transactionType,
            time: getCurrentDateTime(),
        }));
    }

    function getCurrentDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
        return dateTimeString;
    }

    
    function addToIncome(amountEntered) {
        let income = parseInt(localStorage.getItem('income'));
        income += amountEntered;
        localStorage.setItem('income', income);
        showIncome();
        showBalance();
    }

    function addToExpenses(amountEntered) {
        let expenses = parseInt(localStorage.getItem('expenses'));
        expenses += amountEntered;
        localStorage.setItem('expenses', expenses);
        let currentBalance = BALANCE.textContent;
        showExpense();
        showBalance();
    }

    function showIncome() {
        let incomeAmount = parseInt(localStorage.getItem('income')).toLocaleString();
        INCOME.innerHTML = incomeAmount;
        shrinkFontSize(INCOME, incomeAmount);
    }

    function showExpense() {
        let expense = parseInt(localStorage.getItem('expenses')).toLocaleString();
        EXPENSES.innerHTML = expense;
        shrinkFontSize(EXPENSES, expense);
    }

    function showBalance() {
        let balance = (parseInt(localStorage.getItem('income')) - parseInt(localStorage.getItem('expenses'))).toLocaleString();
        BALANCE.innerHTML = balance; 
        shrinkFontSize(BALANCE, balance);
    }

    function shrinkFontSize(fontSizeChange, amount) {
        if (amount.length >= 9) {
            fontSizeChange.style.fontSize = "2rem";
        }
    } 
    
    function addToTable(transactionNumber, comment, amount, transactionType, time) {

        const tbody = document.getElementById('tbody');
        const newRow = tbody.insertRow();
        
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);
    
        let transactionTypeOutput;
        if (transactionType) {
            transactionTypeOutput = 'Kirim';
        } else if (!transactionType) {
            transactionTypeOutput = "Chiqim"
        }

        cell1.textContent = transactionNumber;
        cell2.textContent = comment;
        cell3.textContent = amount.toLocaleString();
        cell4.textContent = transactionTypeOutput;
        cell5.textContent = time;

    }
    
});
