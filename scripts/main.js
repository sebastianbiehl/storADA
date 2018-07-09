const generate = document.querySelector("#generate");
const address = document.querySelector("#address");
const copy = document.querySelector("#copy");
const balanceHTML = document.querySelector("#balance");
let table = document.querySelector("#wallet1-table");
let tbody = document.querySelector("tbody#wallet1");
const btnSend = document.querySelector('#btn-send')
const wallet1 = document.querySelector("#wallet1");
const wallet2 = document.querySelector("#wallet2");
const message = document.querySelector("#message");

let amount, receiver, balance, wallet1Address, wallet2Address
let wallet1Balance, wallet2Balance, type, date, active

let clickDisabled = false
wallet1Balance = 1230
wallet2Balance = 500
active = 'wallet1'
balance = wallet1Balance

const wallet = (e) => {
    table.classList.add('d-none');
    if(e.target.id === 'wallet1') {
        wallet1.classList.add('active');
        wallet2.classList.remove('active');
        wallet1Address ? (address.value = wallet1Address) : (address.value = "");
        if(active !== 'wallet1') {
            active = "wallet1";
            wallet2Balance = balance;
            balance = wallet1Balance;
            tbody = document.querySelector("tbody#wallet1");
            table = document.querySelector("#wallet1-table");
        }
    } else if (e.target.id === "wallet2") {
        wallet2.classList.add('active');
        wallet1.classList.remove('active');
        wallet2Address ? address.value = wallet2Address : address.value = '';
            if (active !== "wallet2") {
            active = "wallet2";
            wallet1Balance = balance;
            balance = wallet2Balance;
            tbody = document.querySelector("tbody#wallet2");
            table = document.querySelector("#wallet2-table");
            }
        }
    table.classList.remove('d-none');
    balanceHTML.innerHTML = (Number(balance).toFixed(2)).replace('.', ',');
}

wallet1.addEventListener("click", wallet);
wallet2.addEventListener("click", wallet);

generate.addEventListener('click', (e) => {
    let random
    address.value = '0x'
    for (i = 0; i < 10; i++) {
        random = Math.floor(Math.random() * 10);
        address.value += random
    }
    if(active === 'wallet1') {
        wallet1Address = address.value
    } else if(active === 'wallet2') {
        wallet2Address = address.value
    }
})

copy.addEventListener("click", (e) => {
    navigator.clipboard.writeText(address.value);
});

const updateHistory = () => {
    let tr = document.createElement("tr")
    let dateT = document.createElement("td")
    let typeT = document.createElement("td");
    let addressT = document.createElement("td");
    let amountT = document.createElement("td");
    let symbol = document.createElement("span");

    symbol.classList.add('ada-ticker')

    dateT.appendChild(document.createTextNode(date))
    typeT.appendChild(document.createTextNode(type));
    addressT.appendChild(document.createTextNode(receiver));

    if(type === 'senden') {
        amountT.appendChild(document.createTextNode("- " + Number(amount).toFixed(2).replace('.', ',')));
        amountT.classList.add('text-danger')
    } else if(type === 'empfangen') {
        amountT.appendChild(document.createTextNode("+ " + Number(amount)
                .toFixed(2)
                .replace(".", ",")));
        amountT.classList.add("text-success");
    }
    if(wallet1Address === receiver && type === 'senden') {
        if (active === 'wallet2') {
            tbody = document.querySelector("tbody#wallet1");
            table = document.querySelector("#wallet1-table");
        } 
        type = 'empfangen'
        updateHistory()
        type = "senden";
    } else if(wallet2Address === receiver && type === 'senden') {
        if (active === 'wallet1') {
            tbody = document.querySelector("tbody#wallet2");
            table = document.querySelector("#wallet2-table");
        } 
        type = 'empfangen';
        updateHistory()
        type = "senden";
    }

    amountT.appendChild(symbol);
    tr.appendChild(dateT);
    tr.appendChild(typeT);
    tr.appendChild(addressT);
    tr.appendChild(amountT);
    tbody.prepend(tr);

    if(active === 'wallet1' && type === 'empfangen') {
        wallet2Balance += Number(amount);
        tbody = document.querySelector("tbody#wallet1");
        table = document.querySelector("#wallet1-table");
    } else if (active === "wallet2" && type === "empfangen") {
             wallet1Balance += Number(amount);
             tbody = document.querySelector("tbody#wallet2");
             table = document.querySelector("#wallet2-table");
           }
}

 btnSend.addEventListener('click', (e) => {
     if(clickDisabled === false) {
     
        if (document.querySelector("#receiver").value === '') {
            document.querySelector("#receiver").classList.add("invalid-custom");
            document.querySelector("#receiver").focus();
            return
        } else {
            document.querySelector("#receiver").classList.remove('invalid-custom');
        }

        if (document.querySelector("#amount").value === '') {
            document
                .querySelector("#amount")
                .classList.add("invalid-custom");
            document.querySelector("#amount").focus();
            return
        } else {
            document.querySelector("#amount").classList.remove("invalid-custom");
        }
        
        dt = new Date();
        receiver = document.querySelector("#receiver").value

        if ((receiver === wallet1Address && active === 'wallet1') || (receiver === wallet2Address && active === 'wallet2')) {
            document.querySelector("#receiver").classList.add("is-invalid");
            document.querySelector("#receiver").focus();
            return;
        } else {
            document.querySelector("#receiver").classList.remove('is-invalid');
            document.querySelector("#receiver").classList.add("border-dark");
        }
        
        amount = document.querySelector("#amount").value.replace(',', '.')
        if (isNaN(Number(amount)) || amount > Number(balanceHTML.innerHTML.replace(",", ".")) || amount <= 0) {
        document.querySelector("#amount").classList.add("is-invalid");
        document.querySelector("#amount").focus();
        return;
        } else {
        document.querySelector("#amount").classList.remove("is-invalid");
        document.querySelector("#amount").classList.add("border-dark");
        }

        clickDisabled = true
        //progress bar
        document.querySelector(".progress").classList.remove("d-none");
        $(".progress-bar").animate({
            width: "100%"
        }, 2500);

        setTimeout(() => {
            $(".progress-bar").attr("style", "width: 0%");
            document.querySelector(".progress").classList.add("d-none");
            document.querySelector(".alert").classList.remove("d-none");
            setTimeout(() => document.querySelector(".alert").classList.add("d-none"), 5000)
            balance = Number((balanceHTML.innerHTML).replace(',', '.')) - Number(amount);
            date = dt.getDate() + '.' + (Number(dt.getMonth()) + 1) + "." + dt.getFullYear();
            type = 'senden';
            balanceHTML.innerHTML = (Number(balance).toFixed(2)).replace('.', ',');
            document.querySelector("#receiver").value = ''
            document.querySelector("#amount").value = ''
            message.value = ''
            updateHistory();
            clickDisabled = false;
        }, 3500)
        btnSend.disabled = false
    }
 })

