import { currenciesList, exchangeRatesHead, longestSequenceStorageKey } from "./globalConsts.js";
import {
    assembleTableData,
    calculateLongestSequence,
    combineExchangeRates,
    determineTableGroupData,
    extractAdditionalRates,
    getTodayFormated,
    sortCurrencyRates
} from "./utils.js";

export const buildStorageData = (data = []) => {
    const result = {};

    data.forEach((currentCurrencyData, index) => {
        const currentCurrency = currenciesList[index];
        const rates = currentCurrencyData[currentCurrency];
        const { sortedValues, sortedCurrenciesCodes } = sortCurrencyRates(rates, currentCurrency);
        const displayData = assembleTableData(sortedValues, sortedCurrenciesCodes);
        const additionalValues = extractAdditionalRates(data, currentCurrency);
        const longestSequence = combineExchangeRates(sortedValues, additionalValues, currentCurrencyData);

        result[currentCurrency] = {
            tableGroupData: determineTableGroupData(displayData),
            [longestSequenceStorageKey]: calculateLongestSequence(longestSequence)
        };
    });

    return result;
};

export const getStoredDataPerKey = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

export const removeStoredDataPerKey = (key) => {
    JSON.parse(localStorage.removeItem(key));
};

export const populateLocalStoragePerKeyPerKey = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getStoredDataForCurrency = (currency) => {
    const key = `${exchangeRatesHead}_${getTodayFormated()}`;
    const storedData = getStoredDataPerKey(key) || {};

    return storedData[currency.toLowerCase()];
};

export const cleanExchangeRates = () => {
    Object.keys(localStorage).forEach(element => {
        if(element.includes(exchangeRatesHead)){
            removeStoredDataPerKey(element); 
        }
    }); 
};