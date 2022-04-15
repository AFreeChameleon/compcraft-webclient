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

export const setFileContent = (value: string) => ({
    type: NOTEPAD_SET_FILE_CONTENT,
    value: value
});

export const setFileName = (value: string) => ({
    type: NOTEPAD_SET_FILE_NAME,
    value: value
});

export const setFilePath = (value: string) => ({
    type: NOTEPAD_SET_FILE_PATH,
    value: value
});

export const setZIndex = (value: number) => ({
    type: NOTEPAD_SET_ZINDEX,
    value: value
});

export const setWindowPosition = (x: number, y: number) => ({
    type: NOTEPAD_SET_WINDOW_POSITION,
    x: x,
    y: y
});

export const setWindowSize = (width: number, height: number) => ({
    type: NOTEPAD_SET_WINDOW_SIZE,
    width: width,
    height: height
});

export const setWindowOpen = (value: boolean) => ({
    type: NOTEPAD_SET_WINDOW_OPEN,
    value: value
});

export const setWindowState = (value: string) => ({
    type: NOTEPAD_SET_WINDOW_STATE,
    value: value
});