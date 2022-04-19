import _ from 'lodash';
import {
    NOTEPAD_SET_FILE_CONTENT,
    NOTEPAD_SET_FILE_NAME,
    NOTEPAD_SET_FILE_PATH,
    NOTEPAD_SET_ZINDEX,
    NOTEPAD_SET_WINDOW_POSITION,
    NOTEPAD_SET_WINDOW_SIZE,
    NOTEPAD_SET_WINDOW_STATE,

    NOTEPAD_CREATE_WINDOW,
    NOTEPAD_DELETE_WINDOW,
} from './types';

const setWindowProperty = (state: any, id: string, key: string, value: any) => {
    const windows = _.cloneDeep(state.windows);
    const idx = state.windows.findIndex((w) => w.id === id);
    windows.splice(
        idx, 
        1,
        {
            ...state.windows[idx],
            [key]: value
        }
    );
    console.log(windows, idx)
    return windows;
}

const setWindowFileProperty = (state: any, id: string, key: string, value: any) => {
    const windows = _.cloneDeep(state.windows);
    const idx = state.windows.findIndex((w) => w.id === id);
    windows.splice(
        idx, 
        1,
        {
            ...state.windows[idx],
            file: {
                ...state.windows[idx].file,
                [key]: value
            }
        }
    );
    return windows;
}

const defaultState = {
    windows: [
        // type Window goes in here
    ]
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case NOTEPAD_SET_FILE_CONTENT:
            return {
                ...state,
                windows: [
                    ...setWindowFileProperty(state, action.id, 'content', action.value),
                ]
            }
        case NOTEPAD_SET_FILE_NAME:
            return {
                ...state,
                windows: [
                    ...setWindowFileProperty(state, action.id, 'name', action.value),
                ]
            }
        case NOTEPAD_SET_FILE_PATH:
            return {
                ...state,
                windows: [
                    ...setWindowFileProperty(state, action.id, 'path', action.value),
                ]
            }
        case NOTEPAD_SET_ZINDEX:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'zIndex', action.value),
                ]
            }
        case NOTEPAD_CREATE_WINDOW:
            return {
                ...state,
                windows: [
                    ...state.windows,
                    {
                        id: state.windows.length ? 
                            Math.max(...state.windows.map((w) => w.id)) + 1 : 1,
                        ...action.window
                    }
                ]
            }
        case NOTEPAD_DELETE_WINDOW:
            return {
                ...state,
                windows: [
                    ...state.windows.filter((w) => w.id !== action.id)
                ]
            }
        case NOTEPAD_SET_WINDOW_POSITION:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'position', [action.x, action.y]),
                ]
            }
        case NOTEPAD_SET_WINDOW_SIZE:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'size', [action.width, action.height]),
                ]
            }
        case NOTEPAD_SET_WINDOW_STATE:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'state', action.value),
                ]
            }
        default:
            return state;
    }
}

export default reducer;