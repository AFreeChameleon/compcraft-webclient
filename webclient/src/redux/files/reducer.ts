import _ from 'lodash';
import {
    FILES_SET_SELECTED_DISK,
    FILES_SET_CURRENT_PATH,
    FILES_SET_STRUCTURE_FILE_NAME,
    FILES_SET_STRUCTURE_FILE_PATH,
    FILES_SET_STRUCTURE_FILE_DIRECTORY,
    FILES_SET_STRUCTURE,
    FILES_SET_DISKS,

    FILES_SET_ZINDEX,
    FILES_SET_WINDOW_POSITION,
    FILES_SET_WINDOW_SIZE,
    FILES_SET_WINDOW_STATE,
    FILES_CREATE_WINDOW,
    FILES_DELETE_WINDOW,
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

const setWindowStructure = (state: any, id: string, structure: any) => {
    const windows = _.cloneDeep(state.windows);
    const idx = state.windows.findIndex((w) => w.id === id);
    windows.splice(
        idx, 
        1,
        {
            ...state.windows[idx],
            structure: [
                ...structure
            ]
        }
    );
    return windows;
}

const setWindowStructureFileProperty = (state: any, id: string, path: string, key: string, value: any) => {
    const windows = _.cloneDeep(state.windows);
    const idx = state.windows.findIndex((w) => w.id === id);
    const structureIdx = windows[idx].structure.findIndex((f) => f.path === path);
    windows[idx].structure.splice(
        structureIdx, 
        1,
        {
            ...state.windows[idx].structure,
            [key]: value
        }
    );
    return windows;
}

const defaultState = {
    windows: [
        // type Window goes in here
    ],
    disks: [

    ],
}

const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case FILES_SET_SELECTED_DISK:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'currentPath', action.value)
                ]
            }
        case FILES_SET_CURRENT_PATH:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'currentPath', action.value)
                ]
            }
        case FILES_SET_STRUCTURE_FILE_NAME:
            return {
                ...state,
                windows: [
                    ...setWindowStructureFileProperty(state, action.id, action.path, 'name', action.value)
                ]
            }
        case FILES_SET_STRUCTURE_FILE_PATH:
            return {
                ...state,
                windows: [
                    ...setWindowStructureFileProperty(state, action.id, action.path, 'path', action.value)
                ]
            }
        case FILES_SET_STRUCTURE_FILE_DIRECTORY:
            return {
                ...state,
                windows: [
                    ...setWindowStructureFileProperty(state, action.id, action.path, 'directory', action.value)
                ]
            }
        case FILES_SET_STRUCTURE:
            return {
                ...state,
                windows: [
                    ...setWindowStructure(state, action.id, action.value)
                ]
            }
        case FILES_SET_DISKS:
            return {
                ...state,
                disks: [
                    ...action.value
                ]
            }

        case FILES_SET_ZINDEX:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'zIndex', action.value),
                ]
            }
        case FILES_CREATE_WINDOW:
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
        case FILES_DELETE_WINDOW:
            return {
                ...state,
                windows: [
                    ...state.windows.filter((w) => w.id !== action.id)
                ]
            }
        case FILES_SET_WINDOW_POSITION:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'position', [action.x, action.y]),
                ]
            }
        case FILES_SET_WINDOW_SIZE:
            return {
                ...state,
                windows: [
                    ...setWindowProperty(state, action.id, 'size', [action.width, action.height]),
                ]
            }
        case FILES_SET_WINDOW_STATE:
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