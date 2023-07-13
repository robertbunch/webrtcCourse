import './ProDashboard.css'

const ProDashboard = ()=>{
    console.log("Test")
    return(
        <div className="container">
            <div className="row">
                <div className="col-12 main-border purple-bg"></div>
            </div>
            <div className="row">
                <div className="col-3 purple-bg left-rail text-center">
                    <i className="fa fa-user mb-3"></i>
                    <div className="menu-item active">
                        <li><i className="fa fa-table-columns"></i>Dashboard</li>
                    </div>
                    <div className="menu-item">
                        <li><i className="fa fa-calendar"></i>Calendar</li>
                    </div>
                    <div className="menu-item">
                        <li><i className="fa fa-gear"></i>Settings</li>
                    </div>
                    <div className="menu-item">
                        <li><i className="fa fa-file-lines"></i>Files</li>
                    </div>
                    <div className="menu-item">
                        <li><i className="fa fa-chart-pie"></i>Reports</li>
                        </div>
                </div>
                <div className="col-8">
                    <div className="row">
                        <h1>Dashboard</h1>
                        <div className="row num-1">
                            <div className="col-6">
                                <div className="dash-box clients-board orange-bg">
                                    <h4>Clients</h4>
                                    <li className="client">Jim Jones</li>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="dash-box clients-board blue-bg">
                                    <h4>Coming Appointments</h4>
                                    <li className="client">Akash Patel - 8-10-23 11am <div className="waiting-text d-inline-block">Waiting</div><button className="btn btn-danger join-btn">Join</button></li>
                                    <li className="client">Jim Jones - 8-10-23, 2pm</li>
                                    <li className="client">Mike Williams - 8-10-23 3pm</li>
                                </div>
                                
                            </div>
                        </div>
                        <div className="row num-2">
                            <div className="col-6">
                                <div className="dash-box clients-board green-bg">
                                    <h4>Files</h4>
                                    <div className="pointer"><i className="fa fa-plus"></i> <i className="fa fa-folder"></i></div>
                                    <div className="pointer"><i className="fa fa-plus"></i> file</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="dash-box clients-board redish-bg">
                                    <h4>Analytics</h4>
                                    <div className="text-center">
                                        <img src="https://s3.amazonaws.com/robertbunch.dev.publicresources/722443_infographic07.jpg" />
                                    </div>
                                </div>
                            </div>

                            

                        </div>
                    </div>
                    <div className="row num-2">
                        <div className="col-4 calendar">
                            <img src="https://s3.amazonaws.com/robertbunch.dev.publicresources/calendar.png" />
                        </div>    
                    </div>
                </div>



            </div>            
        </div>
    )
}

export default ProDashboard