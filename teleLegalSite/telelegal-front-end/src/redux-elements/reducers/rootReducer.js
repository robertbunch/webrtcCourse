import { combineReducers } from "redux";
import callStatusReducer from "./callStatusReducer";

const rootReducer = combineReducers({
    callStatus: callStatusReducer
})

export default rootReducer