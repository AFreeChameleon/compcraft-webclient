import {
    GENERAL_SET_TIME,
    GENERAL_SET_DATE
} from './types';

export const setTime = (value: string) => ({
    type: GENERAL_SET_TIME,
    value: value
});

export const setDate = (value: string) => ({
    type: GENERAL_SET_DATE,
    value: value
});