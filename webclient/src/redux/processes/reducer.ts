import {
    PROCESSES_SET_WINDOW_OPEN,
    PROCESSES_SET_WINDOW_POSITION,
    PROCESSES_SET_WINDOW_SIZE,
    PROCESSES_SET_WINDOW_STATE,
    PROCESSES_SET_ZINDEX,
    PROCESSES_SET_PROCESS_LIST
} from './types';

const defaultState = {
    zIndex: 0,
    windowSize: [
        800,
        600
    ],
    windowPosition: [
        0,
        0
    ],
    open: false,
    windowState: 'windowed',
    processList: []
};

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case PROCESSES_SET_PROCESS_LIST:
            return {
                ...state,
                processList: action.value
            }
        case PROCESSES_SET_WINDOW_POSITION:
            return {
                ...state,
                windowPosition: [action.x, action.y],
            }
        case PROCESSES_SET_WINDOW_SIZE:
            return {
                ...state,
                windowSize: [action.width, action.height]
            }
        case PROCESSES_SET_WINDOW_OPEN:
            return {
                ...state,
                open: action.value
            }
        case PROCESSES_SET_WINDOW_STATE:
            return {
                ...state,
                open: action.value
            }
        case PROCESSES_SET_ZINDEX:
            return {
                ...state,
                zIndex: action.value
            }
        default:
            return state;
    }
}

export default reducer;