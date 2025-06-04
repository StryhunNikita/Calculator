// === Получение элементов ===

const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const utilityButtons = document.querySelectorAll(".utility");
const equalsButton = document.querySelector(".equals");
const clearOrBackSpaceButton = document.querySelector(".utility");

// === Переменные состояния ===

let currentInput = "";
let fullExpression = "";

// === Функции ===

function updateDisplay() {
    display.textContent = fullExpression || "0";
}

function appendNumber(num) {
    if (num === "." && (currentInput === "" || currentInput === "-")) {
        currentInput += "0.";
        fullExpression += "0.";
        updateDisplay();
        return;
    }

    if (num === "." && currentInput.includes(".")) return;

    if (fullExpression.includes("=") || currentInput === "Ошибка") {
        fullExpression = "";
        currentInput = "";
    }

    currentInput += num;
    fullExpression += num;

    if (clearOrBackSpaceButton.textContent === "AC") {
        clearOrBackSpaceButton.textContent = "←";
    }

    updateDisplay(currentInput);
}

function clearAll() {
    currentInput = "";
    fullExpression = "";
    updateDisplay();
}

function chooseOperator(operator) {
    if (currentInput === "" && !fullExpression.includes("=")) return;
 
    if (fullExpression.includes("=")) {
        fullExpression = currentInput;
    }

    fullExpression += " " + operator + " ";
    currentInput = "";

    clearOrBackSpaceButton.textContent = "←";
    updateDisplay();
}

function calculate() {
    try {
        let result = eval(fullExpression);
        currentInput = result.toString();
        fullExpression = currentInput;
        updateDisplay();
    } catch (error) {
        currentInput = "Ошибка";
        fullExpression = "";
        updateDisplay();
    }

    clearOrBackSpaceButton.textContent = "AC";
}

function toggleSign() {
    if (currentInput === "") return;

    if (currentInput.startsWith("-")) {
        currentInput = currentInput.slice(1); 
    } else {
        currentInput = "-" + currentInput; 
    }

    const lastNumberLength = currentInput.startsWith("-") ? currentInput.length - 1 : currentInput.length;
    fullExpression = fullExpression.slice(0, fullExpression.length - lastNumberLength);
    fullExpression += currentInput;

    updateDisplay();
}

function deleteLast() {
    if (currentInput !== "") {
        currentInput = currentInput.slice(0, -1);
        fullExpression = fullExpression.slice(0, -1);
    } else if (fullExpression.endsWith(" ")) {
        fullExpression = fullExpression.slice(0, -3);
    } else if (fullExpression.endsWith(".")) {
        fullExpression = fullExpression.slice(0, -1);
    }

    if (!/\d/.test(fullExpression)) {
        currentInput = "";
        clearOrBackSpaceButton.textContent = "AC";
    }

    const lastToken = fullExpression.trim().split(" ").slice(-1)[0];
    if (/^\-?\d+(\.\d+)?$/.test(lastToken)) {
        currentInput = lastToken;
    }

    updateDisplay();
}

// === Обработчики событий ===

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        appendNumber(button.textContent);    
    });
});

utilityButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.textContent == "AC") {
            clearAll();
        }

        if (button.textContent === "±") {
            toggleSign();
        }

        if (button.textContent === "←") {
            deleteLast();
        }
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        chooseOperator(button.textContent);
    });
});

equalsButton.addEventListener("click", () => {
  calculate();
});