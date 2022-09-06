import { currenciesList } from "./globalConsts.js";
import { buildStorageData, populateLocalStoragePerKeyPerKey } from "./localStorageHandlers.js";
import { updateUI } from "./uiLogic.js";
import { getTodayFormated } from "./utils.js";

const handleSuccessCurrencyFetch = (currency, data) => {
    const modifiedData = buildStorageData(data, currency);
    const today = getTodayFormated();
    populateLocalStoragePerKeyPerKey(today, modifiedData);
}

export const fetchCurrencyData = (currency = currenciesList[0]) => {
    const requestedUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}.json`;

    $.get(requestedUrl, (data) => {
        handleSuccessCurrencyFetch(currency, data);
    })
        .done(() => {
            updateUI(currency)
        }).fail(() => {
            alert("somethings gone wrong");
        })
};