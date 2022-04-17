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

    NotepadWindow
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

export const createWindow = (windowProps: NotepadWindow) => ({
    type: NOTEPAD_CREATE_WINDOW,
    window: windowProps
});

export const deleteWindow = (id: number) => ({
    type: NOTEPAD_DELETE_WINDOW,
    id: id
});

export const setZIndex = (id: number, value: number) => ({
    type: NOTEPAD_SET_ZINDEX,
    id: id,
    value: value,
});

export const setWindowPosition = (id: number, x: number, y: number) => ({
    type: NOTEPAD_SET_WINDOW_POSITION,
    id: id,
    x: x,
    y: y,
});

export const setWindowSize = (id: number, width: number, height: number) => ({
    type: NOTEPAD_SET_WINDOW_SIZE,
    id: id,
    width: width,
    height: height,
});

export const setWindowState = (id: number, value: string) => ({
    type: NOTEPAD_SET_WINDOW_STATE,
    id: id,
    value: value,
});