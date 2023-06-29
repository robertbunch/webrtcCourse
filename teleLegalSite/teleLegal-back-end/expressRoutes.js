//this is where all our express stuff happens (routes)
const app = require('./server').app;
const jwt = require('jsonwebtoken');
const linkSecret = "ijr2iq34rfeiadsfkjq3ew";


//this route is for US! In production, a receptionist, or calender/scheduling app
//would send this out. We will print it out and paste it in. It will drop
//us on our React site with the right info for CLIENT1 to make an offer
app.get('/user-link',(req, res)=>{

    //data for the end-user's appt
    const apptData = {
        professionalsFullName: "Robert Bunch, J.D.",
        apptDate: Date.now()
    }

    //we need to encode this data in a token
    //so it can be added to a url
    const token = jwt.sign(apptData,linkSecret);
    res.send('https://localhost:3000/join-video?token='+token);
    // res.json("This is a test route")
})  

app.get('/validate-link',(req, res)=>{
    const token = req.query.token;
    const decodedData = jwt.verify(token,linkSecret);
    res.json(decodedData)
})