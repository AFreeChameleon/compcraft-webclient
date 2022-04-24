export const FILES_SET_SELECTED_DISK = 'FILES_SET_SELECTED_DISK';
export const FILES_SET_CURRENT_PATH = 'FILES_SET_CURRENT_PATH';
export const FILES_SET_STRUCTURE_FILE_NAME = 'FILES_SET_STRUCTURE_FILE_NAME';
export const FILES_SET_STRUCTURE_FILE_PATH = 'FILES_SET_STRUCTURE_FILE_PATH';
export const FILES_SET_STRUCTURE_FILE_DIRECTORY = 'FILES_SET_STRUCTURE_FILE_DIRECTORY';
export const FILES_SET_DISKS = 'FILES_SET_DISKS';
export const FILES_SET_STRUCTURE = 'FILES_SET_STRUCTURE';

export const FILES_SET_ZINDEX = 'FILES_SET_ZINDEX';
export const FILES_SET_WINDOW_POSITION = 'FILES_SET_WINDOW_POSITION';
export const FILES_SET_WINDOW_SIZE = 'FILES_SET_WINDOW_SIZE';
export const FILES_SET_WINDOW_OPEN = 'FILES_SET_WINDOW_OPEN';
export const FILES_SET_WINDOW_STATE = 'FILES_SET_WINDOW_STATE';
export const FILES_CREATE_WINDOW = 'FILES_CREATE_WINDOW';
export const FILES_DELETE_WINDOW = 'FILES_DELETE_WINDOW';

export type Disk = {
    path: string;
    name?: string;
}

export type File = {
    name: string;
    directory: boolean;
}

export type FilesWindow = {
    id: number;
    zIndex: number;
    size: [
        number,
        number
    ];
    position: [
        number,
        number
    ];
    state: 'windowed' | 'minimised' | 'maximised';
    structure: File[];
    currentPath: string;
    selectedDisk: string;
}