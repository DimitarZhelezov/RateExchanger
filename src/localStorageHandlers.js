import { currenciesList, exchangeRatesHead, firstGroupString, secondGroupString, thirtGroupString } from "./globalConsts.js";
import { calculateLongestSequence, getRateGroupString, getSpliceIndex, getTodayFormated } from "./utils.js";

export const buildStorageData = (data = {}, selectedCurrency) => {
    const dateToday = getTodayFormated();
    const rates = data[selectedCurrency];
    const storedData = getStoredDataPerKey(`${exchangeRatesHead}_${dateToday}`);
    const tableData = {
        [firstGroupString]: [],
        [secondGroupString]: [],
        [thirtGroupString]: []
    };
    const sortedArray = [];

    currenciesList
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

export const removeStoredDataPerKey = (key) => {
    JSON.parse(localStorage.removeItem(key));
}

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