export const NOTEPAD_SET_FILE_CONTENT = 'NOTEPAD_SET_FILE_CONTENT';
export const NOTEPAD_SET_FILE_NAME = 'NOTEPAD_SET_FILE_NAME';
export const NOTEPAD_SET_FILE_PATH = 'NOTEPAD_SET_FILE_PATH';
export const NOTEPAD_SET_ZINDEX = 'NOTEPAD_SET_ZINDEX';
export const NOTEPAD_SET_WINDOW_POSITION = 'NOTEPAD_SET_WINDOW_POSITION';
export const NOTEPAD_SET_WINDOW_SIZE = 'NOTEPAD_SET_WINDOW_SIZE';
export const NOTEPAD_SET_WINDOW_OPEN = 'NOTEPAD_SET_WINDOW_OPEN';
export const NOTEPAD_SET_WINDOW_STATE = 'NOTEPAD_SET_WINDOW_STATE';
export const NOTEPAD_CREATE_WINDOW = 'NOTEPAD_CREATE_WINDOW';
export const NOTEPAD_DELETE_WINDOW = 'NOTEPAD_DELETE_WINDOW';

export type NotepadWindow = {
  id: number;
  zIndex: number,
  size: [
      number,
      number
  ],
  position: [
      number,
      number
  ],
  state: 'windowed' | 'minimised' | 'maximised',
}