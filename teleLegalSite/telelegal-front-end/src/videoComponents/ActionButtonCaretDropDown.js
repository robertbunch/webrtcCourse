
const ActionButtonCaretDropDown = ({defaultValue,changeHandler,deviceList})=>{
        return(
            <div className="caret-dropdown" style={{top:"-25px"}}>
                <select defaultValue={defaultValue} onChange={changeHandler}>
                    {deviceList.map(vd=><option key={vd.deviceId} value={vd.deviceId}>{vd.label}</option>)}
                </select>
            </div>
        )
}

export default ActionButtonCaretDropDown