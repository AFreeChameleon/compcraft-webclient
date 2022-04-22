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
    FilesWindow,
    File,
    Disk,
} from './types';

export const setSelectedDisk = (id: number, value: string) => ({
    type: FILES_SET_SELECTED_DISK,
    id: id,
    value: value
});

export const setCurrentPath = (id: number, value: string) => ({
    type: FILES_SET_CURRENT_PATH,
    id: id,
    value: value
});

export const setStructureFileName = (id: number, path: string, value: string) => ({
    type: FILES_SET_STRUCTURE_FILE_NAME,
    id: id,
    path: path,
    value: value
});

export const setStructureFilePath = (id: number, path: string, value: string) => ({
    type: FILES_SET_STRUCTURE_FILE_PATH,
    id: id,
    path: path,
    value: value
});

export const setStructureFileDirectory = (id: number, path: string, value: boolean) => ({
    type: FILES_SET_STRUCTURE_FILE_DIRECTORY,
    id: id,
    path: path,
    value: value
});

export const setStructure = (id: number, value: File[]) => ({
    type: FILES_SET_STRUCTURE,
    id: id,
    value: value
});

export const setDisks = (id = null, value: Disk[]) => ({
    type: FILES_SET_DISKS,
    id: id,
    value: value
});

export const createWindow = (windowProps: FilesWindow) => ({
    type: FILES_CREATE_WINDOW,
    window: windowProps
});

export const deleteWindow = (id: number) => ({
    type: FILES_DELETE_WINDOW,
    id: id
});

export const setZIndex = (id: number, value: number) => ({
    type: FILES_SET_ZINDEX,
    id: id,
    value: value,
});

export const setWindowPosition = (id: number, x: number, y: number) => ({
    type: FILES_SET_WINDOW_POSITION,
    id: id,
    x: x,
    y: y,
});

export const setWindowSize = (id: number, width: number, height: number) => ({
    type: FILES_SET_WINDOW_SIZE,
    id: id,
    width: width,
    height: height,
});

export const setWindowState = (id: number, value: string) => ({
    type: FILES_SET_WINDOW_STATE,
    id: id,
    value: value,
});