import {
    PROCESSES_SET_WINDOW_POSITION,
    PROCESSES_SET_WINDOW_SIZE,
    PROCESSES_SET_WINDOW_STATE,
    PROCESSES_SET_ZINDEX,
    PROCESSES_SET_PROCESS_LIST
} from './types';

export const setWindowSize = (id: number, width: number, height: number) => ({
    type: PROCESSES_SET_WINDOW_SIZE,
    id: id,
    width: width,
    height: height,
});

export const setWindowState = (id: number, value: string) => ({
    type: PROCESSES_SET_WINDOW_STATE,
    id: id,
    value: value,
});

export const setZIndex = (id: number, value: number) => ({
    type: PROCESSES_SET_ZINDEX,
    id: id,
    value: value,
});

export const setWindowPosition = (id: number, x: number, y: number) => ({
    type: PROCESSES_SET_WINDOW_POSITION,
    id: id,
    x: x,
    y: y,
});

export const setProcessList = (value: any[]) => ({
    type: PROCESSES_SET_PROCESS_LIST,
    value: value
});