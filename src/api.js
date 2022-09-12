import { currenciesList, exchangeRatesHead } from "./globalConsts.js";
import { buildStorageData, populateLocalStoragePerKeyPerKey } from "./localStorageHandlers.js";
import { updateUI } from "./uiLogic.js";
import { getTodayFormated } from "./utils.js";

export const handleSuccessCurrencyFetch = (data) => {
    const key = `${exchangeRatesHead}_${getTodayFormated()}`;
    populateLocalStoragePerKeyPerKey(key, data);
}

export const fetchCurrencyData = (currency = currenciesList[0]) => {
    const requestedUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency}.json`;

    return $.get(requestedUrl, (data) => {
    })
        .fail(() => {
             alert("somethings gone wrong");
        })
};