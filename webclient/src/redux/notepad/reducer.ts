import {
    NOTEPAD_SET_FILE_CONTENT,
    NOTEPAD_SET_FILE_NAME,
    NOTEPAD_SET_FILE_PATH,
    NOTEPAD_SET_ZINDEX,
    NOTEPAD_SET_WINDOW_POSITION,
    NOTEPAD_SET_WINDOW_SIZE,
    NOTEPAD_SET_WINDOW_OPEN,
    NOTEPAD_SET_WINDOW_STATE,
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
    file: {
        name: '',
        content: '',
        path: ''
    }
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case NOTEPAD_SET_FILE_CONTENT:
            return {
                ...state,
                file: {
                    ...state.file,
                    content: action.value
                }
            }
        case NOTEPAD_SET_FILE_NAME:
            return {
                ...state,
                file: {
                    ...state.file,
                    name: action.value
                }
            }
        case NOTEPAD_SET_FILE_PATH:
            return {
                ...state,
                file: {
                    ...state.file,
                    path: action.value
                }
            }
        case NOTEPAD_SET_ZINDEX:
            return {
                ...state,
                zIndex: action.value
            }
        case NOTEPAD_SET_WINDOW_POSITION:
            return {
                ...state,
                windowPosition: [action.x, action.y],
            }
        case NOTEPAD_SET_WINDOW_SIZE:
            return {
                ...state,
                windowSize: [action.width, action.height]
            }
        case NOTEPAD_SET_WINDOW_OPEN:
            return {
                ...state,
                open: action.value
            }
        case NOTEPAD_SET_WINDOW_STATE:
            return {
                ...state,
                open: action.value
            }
        default:
            return state;
    }
}

export default reducer;