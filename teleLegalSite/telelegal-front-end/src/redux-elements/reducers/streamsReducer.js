//this holds all streams as objects
//{
    // who
    // stream
// }

//local, remote1, remote2+

export default (state, action)=>{
    if(action.type === "ADD_STREAM"){
        const copyState = {...state};
        copyState[action.payload.who] = action.payload
        return copyState
    }else if(action.type === "LOGOUT_ACTION"){
        return {}
    }else{
        return state;
    }
}