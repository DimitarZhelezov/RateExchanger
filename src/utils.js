import { fetchCurrencyData } from './api.js';
import {
    firstGroupString, 
    fiveTenths, 
    secondGroupString, 
    thirtGroupString
} from './globalConsts.js';
import { currenciesList } from "./globalConsts.js";
import { getStoredDataForCurrency } from './localStorageHandlers.js';
import { updateUI } from "./uiLogic.js";

export const getRateGroupString = (value) => {
    let result = firstGroupString;

    if (value >= 1 && value < 1.5) {
        result = secondGroupString;
    } else if (value >= 1.5) {
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

const initialLoad = () => {
    fetchCurrencyData();
};

export const getLoadStrategy = (currency = currenciesList[0]) => {
    const hasTodaysData = !!getStoredDataForCurrency(currency);
    
    return !hasTodaysData ? initialLoad : sequancyLoad; 
};

export const shouldFetchData = (value) => {
    return !getStoredDataForCurrency(value);
};

export const getLongestGroupLengh = (data = {}) => {
    return Math.max(data[firstGroupString].length, data[secondGroupString].length, data[thirtGroupString].length);
};

const getIsLessThanOrEqual = (input, conditionValue) => {
    return input <= conditionValue;
};

export const calculateLongestSequence = (sortedData = []) => {
    const dataLength = sortedData.length;
    let index = 1;
    let tempLongestSequance = 1;
    let result = 0;
    let currentIndex = 0;

    while(index < dataLength) {
        const currentValue = sortedData[index] - sortedData[index - 1];
        
        if(getIsLessThanOrEqual(currentValue, fiveTenths)){
            tempLongestSequance += 1;
        } else {
            tempLongestSequance = 1;
        }

        if(getIsLessThanOrEqual(result, tempLongestSequance)) {
            result = tempLongestSequance;
        }

        index++;
    }

    return result;
};