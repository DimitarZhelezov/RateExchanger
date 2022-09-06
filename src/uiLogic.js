import { fetchCurrencyData } from "./api.js";
import { currenciesList } from "./globalConsts.js";
import { getStoredDataForCurrency } from "./localStorageHandlers.js";
import { getLongestGroupLengh, shouldFetchData } from "./utils.js";

let selectedCurrency = currenciesList[0];

const cleanTableBody = () => {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
};

const updateLongestSequence = (longestSequenceValue) => {
    const element = document.getElementById("longestSequence");

    element.innerHTML = `Longest sequence: ${longestSequenceValue}`;
};

const updateTableUi = (tableData) => {
    cleanTableBody();
    populateTableData(tableData);
};

export const updateUI = (currency) => {
    const data = getStoredDataForCurrency(currency);

    updateTableUi(data.tableData);
    updateLongestSequence(data.longestSequence);
};

export const onCurrencySelectClick = (currentTarget = {}) => {
    const { value } = currentTarget;
    const lowerCaseValue = value.toLowerCase();

    if (selectedCurrency !== lowerCaseValue){
        selectedCurrency = lowerCaseValue;

        if(shouldFetchData(lowerCaseValue)) {
            fetchCurrencyData(lowerCaseValue);
        } else {
            updateUI(lowerCaseValue);
        }
    };
};

const populateTableData = (data = {}) => {
    const table = document.getElementById("tableBody");
    const maxGroupLengh = getLongestGroupLengh(data);

    for (let rowIndex = 0; rowIndex <= maxGroupLengh; rowIndex++) {
        const row = table.insertRow();
        for (let index = 1; index <= 3; index++) {
            const cell = row.insertCell(index - 1);
            const groupString = `Group${index}`;
            const dispalyData = rowIndex === maxGroupLengh ? data[groupString].length : data[groupString][rowIndex] || '-';
            cell.innerHTML = dispalyData;
        };
    };
};

export const populateSelect = () => {
    const select = document.getElementById("currencySelect");

    currenciesList.forEach(currency => {
        const option = document.createElement('option');
        option.text = currency.toUpperCase();
        select.add(option, 0);
    });
};