const transactionName = document.getElementById("transaction-name");
const amount = document.getElementById("amount");
const types = document.getElementById("type");
const submitBtn = document.getElementById("submitBtn");
const row = document.querySelector("tbody");
const totalBalance = document.getElementById("totalBalance");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const message = document.getElementById("message");

let data = JSON.parse(localStorage.getItem("transactions")) || [];

tableUpdate(data);
statusUpdater(data);

submitBtn.addEventListener("click", () => {
  let id = Date.now();
  let date = new Date().toLocaleDateString();
  let name = transactionName.value.trim();
  if (name == "") {
    let status = false;
    showMessgae("Please enter a transaction name.", status);
    return;
  }
  name = name.charAt(0).toUpperCase() + name.slice(1);
  let rupees = Number(Number(amount.value).toFixed(2));
  if (rupees <= 0) {
    let status = false;
    showMessgae("Please enter an amount greater than 0.", status);
    return;
  }
  let type = types.value;

  addTransaction(id, date, name, rupees, type);
});

function addTransaction(id, date, name, amount, type) {
  data.push({ id, date, name, amount, type });
  localStorage.setItem("transactions", JSON.stringify(data));
  tableUpdate(data);
  statusUpdater(data);
  let status = true;
  showMessgae("Transaction added successfully!", status);
}

function deleteTransaction(id) {
  data = data.filter((obj) => obj.id !== id);
  localStorage.setItem("transactions", JSON.stringify(data));
  tableUpdate(data);
  statusUpdater(data);
  let status = true;
  showMessgae("Transaction deleted successfully!", status);
}

function tableUpdate(data) {
  row.innerHTML = "";
  data.forEach((element, index) => {
    let type = element.type;
    let amountClass = type === "income" ? "income-amount" : "expense-amount";
    let typeClass = type === "income" ? "income" : "expense";
    row.innerHTML += `<tr>
            <td>${index + 1}</td>
            <td>${element.date}</td>
            <td>${element.name}</td>
            <td class=${amountClass}>₹${element.amount}</td>
            <td><span class=${typeClass}>${element.type}</span></td>
            <td><button class="delete-btn" data-id="${element.id}" >DELETE</button></td>
          </tr>`;
  });
  let deleteBtn = document.querySelectorAll(".delete-btn");
  deleteBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      let id = Number(e.target.dataset.id);
      deleteTransaction(id);
    });
  });
}

function statusUpdater(data) {
  let income = data.filter((obj) => obj.type == "income");
  let sumOfIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
  let expense = data.filter((obj) => obj.type == "expense");
  let sumOfExpense = expense.reduce((acc, curr) => acc + curr.amount, 0);
  let balance = sumOfIncome - sumOfExpense;
  totalBalance.textContent = `₹${balance}`;
  totalIncome.textContent = `₹${sumOfIncome}`;
  totalExpense.textContent = `₹${sumOfExpense}`;
}

function showMessgae(text, status) {
  message.classList.remove("message-sucess", "message-failed");
  if (status) {
    message.classList.add("message-sucess");
  } else {
    message.classList.add("message-failed");
  }
  message.textContent = text;
  message.style.visibility = "visible";
  setTimeout(() => {
    message.style.visibility = "hidden";
  }, 3000);
}
