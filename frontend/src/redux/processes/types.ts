export const PROCESSES_SET_ZINDEX = 'PROCESSES_SET_ZINDEX';
export const PROCESSES_SET_WINDOW_POSITION = 'PROCESSES_SET_WINDOW_POSITION';
export const PROCESSES_SET_WINDOW_SIZE = 'PROCESSES_SET_WINDOW_SIZE';
export const PROCESSES_SET_WINDOW_STATE = 'PROCESSES_SET_WINDOW_STATE';
export const PROCESSES_SET_PROCESS_LIST = 'PROCESSES_SET_PROCESS_LIST';

export type Process = {
    name: string;
    stdout: string;
    stderr: string;
}