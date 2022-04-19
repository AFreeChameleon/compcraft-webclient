import { combineReducers } from 'redux';
import notepadReducer from './notepad/reducer';
import processesReducer from './processes/reducer';

const rootReducer = combineReducers({
    notepad: notepadReducer,
    processes: processesReducer
});

export default rootReducer;