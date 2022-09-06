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

export const getLoadStrategy = () => {
    const hasTodaysData = !!getStoredDataForCurrency(currenciesList[0]);
    
    return !hasTodaysData ? initialLoad : sequancyLoad; 
};

export const shouldFetchData = (value) => {
    return !getStoredDataForCurrency(value);
};

export const getLongestGroupLengh = (data = {}) => {
    return Math.max(data[firstGroupString].length, data[secondGroupString].length, data[thirtGroupString].length);
};

const getIsLessThanOrEqual = (x, y) => {
    return x <= y;
};

export const calculateLongestSequence = (sortedData = []) => {
    let currentLongestSequance = 1;
    let result = 0;
    let traversStop = false;
    let traversedIndex = 1;


    for (let index = 0; index < sortedData.length; index++) {
        traversStop = getIsLessThanOrEqual(sortedData, traversedIndex);

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
                currentLongestSequance--;
            };
        }
    }

    return result;
};