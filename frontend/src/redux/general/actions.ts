import {
    GENERAL_SET_TIME
} from './types';

export const setTime = (value: string) => ({
    type: GENERAL_SET_TIME,
    value: value
});