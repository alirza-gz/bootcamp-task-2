const btn = document.querySelector(".btn");
const tableContainer = document.querySelector(".table-container");
const transactionsDOM = document.querySelector(".tbody");
const searchInput = document.querySelector(".search-input");
const sortPrice = document.querySelector(".price .fa-chevron-down");
const sortDate = document.querySelector(".date .fa-chevron-down");

let allTransactionsData = [];

btn.addEventListener("click", fetchTransactions);
searchInput.addEventListener("input", filterTransactions);
sortPrice.addEventListener("click", sortByPrice);
sortDate.addEventListener("click", sortByDate);

/**
 * Fetches transactions from the server and renders them on the page.
 *
 * @return {void} This function does not return a value.
 */
function fetchTransactions() {
    setTimeout(() => {
        btn.style.display = "none";
        tableContainer.style.display = "block";
        axios
            .get("http://localhost:3000/transactions")
            .then((res) => {
                allTransactionsData = res.data;
                renderTransactions(res.data);
            })
            .catch((err) => console.log(err));
    }, 300);
}

/**
 * Renders the given transactions on the transactionsDOM element.
 *
 * @param {Array} transactions - An array of transaction objects.
 * @return {void} This function does not return a value.
 */
function renderTransactions(transactions) {
    transactionsDOM.innerHTML = "";
    transactions.forEach(transaction => {
        const trTag = document.createElement("tr");
        trTag.innerHTML = `
            <td>${transaction.id}</td>
            <td class="${transaction.type === "برداشت از حساب" ? "withdraw" : ""}">${transaction.type}</td>
            <td>${transaction.price.toLocaleString("fa")}</td>
            <td>${transaction.refId}</td>
            <td>${new Date(transaction.date).toLocaleDateString("fa") + ", ساعت: " + new Date(transaction.date).toLocaleTimeString("fa")}</td>
        `;
        transactionsDOM.appendChild(trTag);
    });
}

/**
 * Filters transactions based on user input and sorting criteria, then fetches data from a server.
 *
 * @param {Event} e - The event object containing the user input.
 * @return {void} This function does not return a value.
 */
function filterTransactions(e) {
    const query = e.target.value;
    const sortByPrice = sortPrice.classList.contains("active");
    const sortByDate = sortDate.classList.contains("active");
    let order = null;

    if (sortByPrice) {
        order = sortPrice.classList.contains("active") ? "asc" : "desc";
    } else if (sortByDate) {
        order = sortDate.classList.contains("active") ? "asc" : "desc";
    }

    let url = `http://localhost:3000/transactions?refId_like=${query}`;

    if (sortByPrice) {
        url += `&_sort=price&_order=${order}`;
    }

    if (sortByDate) {
        url += `&_sort=date&_order=${order}`;
    }

    axios
        .get(url)
        .then((res) => {
            allTransactionsData = res.data;
            renderTransactions(allTransactionsData);
        })
        .catch((err) => console.log(err));
}

/**
 * Sorts the transactions by price in ascending or descending order based on the click event.
 *
 * @param {Event} e - The click event that triggered the function.
 * @return {void} This function does not return a value.
 */
function sortByPrice(e) {
    e.target.classList.toggle("active");
    sortDate.classList.remove("active");
    const query = searchInput.value;
    const order = e.target.classList.contains("active") ? "asc" : "desc";
    axios
        .get(`http://localhost:3000/transactions?_sort=price&_order=${order}&refId_like=${query}`)
        .then((res) => {
            allTransactionsData = res.data;
            renderTransactions(allTransactionsData);
        })
        .catch((err) => console.log(err));
}

/**
 * Sorts the transactions by date in ascending or descending order based on the click event.
 *
 * @param {Event} e - The click event that triggered the function.
 * @return {void} This function does not return a value.
 */
function sortByDate(e) {
    e.target.classList.toggle("active");
    sortPrice.classList.remove("active");
    const query = searchInput.value;
    const order = e.target.classList.contains("active") ? "asc" : "desc";
    axios
        .get(`http://localhost:3000/transactions?_sort=date&_order=${order}&refId_like=${query}`)
        .then((res) => {
            allTransactionsData = res.data;
            renderTransactions(allTransactionsData);
        })
        .catch((err) => console.log(err));
}