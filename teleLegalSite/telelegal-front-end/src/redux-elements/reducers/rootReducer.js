import { combineReducers } from "redux";
import callStatusReducer from "./callStatusReducer";
import streamsReducer from "./streamsReducer";

const rootReducer = combineReducers({
    callStatus: callStatusReducer,
    streams: streamsReducer,
})

export default rootReducer