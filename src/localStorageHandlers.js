import { currenciesList, firstGroupString, secondGroupString, thirtGroupString } from "./globalConsts.js";
import { calculateLongestSequence, getRateGroupString, getSpliceIndex, getTodayFormated } from "./utils.js";

export const buildStorageData = (data = {}, selectedCurrency) => {
    const dateToday = getTodayFormated();
    const rates = data[selectedCurrency];
    const storedData = getStoredDataPerKey(dateToday);
    const tableData = {
        [firstGroupString]: [],
        [secondGroupString]: [],
        [thirtGroupString]: []
    };
    const sortedArray = [];

    currenciesList
    //do we really need filter here? 
        .filter((currency => currency !== selectedCurrency))
        .forEach(currency => {
            const rateValue = rates[currency];
            const rateGroup = getRateGroupString(rateValue);

            const spliceIndex = getSpliceIndex(sortedArray, rateValue);
            
            sortedArray.splice(spliceIndex, 0, rateValue);
            tableData[rateGroup].splice(spliceIndex, 0, `${currency.toUpperCase()}:${rateValue}`);
        });

    const longestSequence = calculateLongestSequence(sortedArray);
    
    return {
        ...storedData,
        [selectedCurrency]: {
            tableData,
            'longestSequence': longestSequence
        }
    };
};

export const getStoredDataPerKey = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

export const populateLocalStoragePerKeyPerKey = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const getStoredDataForCurrency = (currency) => {
    const today = getTodayFormated();
    const storedData = getStoredDataPerKey(today) || {};

    return storedData[currency.toLowerCase()];
};