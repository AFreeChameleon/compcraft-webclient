import {
    GENERAL_SET_TIME,
    GENERAL_SET_DATE,
} from './types';

const defaultState = {
    time: '',
    date: ''
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case GENERAL_SET_TIME:
            return {
                ...state,
                time: action.value
            }
        case GENERAL_SET_DATE:
            return {
                ...state,
                date: action.value
            }
        default:
            return state;
    }
}

export default reducer;