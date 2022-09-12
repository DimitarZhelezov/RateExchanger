import { fetchCurrencyData, handleSuccessCurrencyFetch } from './api.js';
import {
    firstGroupString, 
    fiveTenths, 
    secondGroupString, 
    thirtGroupString
} from './globalConsts.js';
import { currenciesList } from "./globalConsts.js";
import { cleanExchangeRates, getStoredDataForCurrency, buildStorageData } from './localStorageHandlers.js';
import { updateUI } from "./uiLogic.js";

export const sortCurrencyRates = (rates, selectedCurrency) => {
    const sortedValues = [];
    const sortedCurrenciesCodes = [];

    currenciesList
        .filter((currency => currency !== selectedCurrency))
        .forEach(currency => {
            const rateValue = rates[currency];
            const spliceIndex = getSpliceIndex(sortedValues, rateValue);
            
            sortedValues.splice(spliceIndex, 0, rateValue);
            sortedCurrenciesCodes.splice(spliceIndex, 0, currency);
        });

    return {
        sortedValues, 
        sortedCurrenciesCodes
    };
};

export const determineTableGroupData = (assebledObject) => {
    const tableGroupData = {
        [firstGroupString]: [],
        [secondGroupString]: [],
        [thirtGroupString]: []
    };

    Object.keys(assebledObject).forEach((key, index) =>{
        const value = assebledObject[key];
        const rateGroup = getRateGroupString(value);
        tableGroupData[rateGroup].push(`${key}: ${value}`);
    });

    return tableGroupData;
};

export const assembleTableData = (values, codes) => {
    let result = {};

    values.forEach((element, index) => result[codes[index]] = element);

    return result
};

export const extractAdditionalRates = (data, selectedCurrency) => {
    const result = [];

    data.forEach(currencyData => Object.keys(currencyData).map(key => {
        if (key != selectedCurrency && currenciesList.indexOf(key) > -1)
            result.push(currencyData[key][selectedCurrency]);
    }));

    return result;
};

const getSecondGroupRule = (value) => {
    return value >= 1 && value < 1.5;
};

const getThirtGroupRule = (value) => {
    return value >= 1.5;
};

export const getRateGroupString = (value) => {
    let result = firstGroupString;

    if (getSecondGroupRule(value)) {
        result = secondGroupString;
    } else if (getThirtGroupRule(value)) {
        result = thirtGroupString;
    };

    return result;
};

export const getSpliceIndex = (tempArr = [], rateGroup) => {
    const index = tempArr.findIndex((element) => element > rateGroup);

    return index == -1 ? tempArr.length : index;
};

export const getTodayFormated = () => {
    const dateNow = new Date();
    return dateNow.toISOString().split('T')[0]; 
};

const sequancyLoad = () => {
    updateUI(currenciesList[0]);
};

const cleanOldData = () => {
    cleanExchangeRates();
}

const initialLoad = () => {
    cleanOldData();
    const promises = [];
    currenciesList.forEach((currency) => {
        promises.push(fetchCurrencyData(currency));
    });

    //Find better approach. What's happening when one of the request fails?
    Promise.all(promises).then((values) => {
        const data = buildStorageData(values);
        handleSuccessCurrencyFetch(data);
        updateUI(currenciesList[0]);
    });
};

export const getLoadStrategy = () => {
    const hasTodaysData = !!getStoredDataForCurrency(currenciesList[0]);
    
    return !hasTodaysData ? initialLoad : sequancyLoad; 
};

export const shouldFetchData = (value) => {
    return !getStoredDataForCurrency(value);
};

export const getLongestGroupLengh = (data = {}) => {
    return Math.max((data[firstGroupString] || []).length, (data[secondGroupString] || []).length, (data[thirtGroupString] || {}).length);
};

const getIsLessThanOrEqual = (x, y) => {
    return x <= y;
};

export const combineExchangeRates = (sortedCurrencyData, rates) => {
    rates.forEach(rate => {

        const spliceIndex = getSpliceIndex(sortedCurrencyData, rate);

        sortedCurrencyData.splice(spliceIndex, 0, rate);
    });

    return sortedCurrencyData;
};

export const calculateLongestSequence = (sortedData) => {
    let currentLongestSequance = 1;
    let result = 1;
    let traversStop = false;
    let traversedIndex = 1;
    const dataLength = sortedData.length;

    for (let index = 0; index < dataLength; index++) {
        traversStop = getIsLessThanOrEqual(dataLength, traversedIndex);

        if(traversedIndex == index) {
            traversedIndex++
        };

        while(!traversStop) {
            const value = Math.abs(sortedData[index] - sortedData[traversedIndex]);

            if(getIsLessThanOrEqual(value, fiveTenths)) {
                currentLongestSequance++;
                result = getIsLessThanOrEqual(result, currentLongestSequance) ? currentLongestSequance : result;
                traversedIndex++
            } else {
                traversStop = true;
                currentLongestSequance = Math.max(currentLongestSequance - 1, 1);
            };
        }
    }

    return result;
};