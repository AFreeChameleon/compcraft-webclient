import {
    GENERAL_SET_TIME
} from './types';

const defaultState = {
    time: ''
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case GENERAL_SET_TIME:
            return {
                ...state,
                time: action.value
            }
    }
}

export default reducer;