//this is where all our express stuff happens (routes)
const app = require('./server').app;
const jwt = require('jsonwebtoken');
const linkSecret = "ijr2iq34rfeiadsfkjq3ew";
const { v4: uuidv4 } = require('uuid');

const professionalAppointments = [];

app.set('professionalAppointments',professionalAppointments)

//this route is for US! In production, a receptionist, or calender/scheduling app
//would send this out. We will print it out and paste it in. It will drop
//us on our React site with the right info for CLIENT1 to make an offer
app.get('/user-link',(req, res)=>{

    const uuid = uuidv4(); //this is standing in as what would be a unique id/primary key in the db

    //data for the end-user's appt
    const apptData = {
        professionalsFullName: "Peter Chan, J.D.",
        apptDate: Date.now() + 500000,
        uuid,
        clientName: "Jim Jones",
    }

    professionalAppointments.push(apptData);

    //we need to encode this data in a token
    //so it can be added to a url
    const token = jwt.sign(apptData,linkSecret);
    res.send('https://localhost:3000/join-video?token='+token);
    // res.json("This is a test route")
})  

app.post('/validate-link',(req, res)=>{
    //get the token from the body of the post request (  thanks express.json() )
    const token = req.body.token;
    //decode the jwt with our secret
    const decodedData = jwt.verify(token,linkSecret);
    //send the decoded data (our object) back to the front end
    res.json(decodedData)
})

app.get('/pro-link',(req, res)=>{
    const userData = {
        fullName: "Peter Chan, J.D.",
        proId: 1234,
    }
    const token = jwt.sign(userData,linkSecret);
    res.send(`<a href="https://localhost:3000/dashboard?token=${token}" target="_blank">Link Here</a>`);
})