import { combineReducers } from 'redux';
import notepadReducer from './notepad/reducer';
import processesReducer from './processes/reducer';
import filesReducer from './files/reducer';
import generalReducer from './general/reducer';

const rootReducer = combineReducers({
    notepad: notepadReducer,
    files: filesReducer,
    processes: processesReducer,
    general: generalReducer
});

export default rootReducer;