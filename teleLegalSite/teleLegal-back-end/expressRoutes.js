//this is where all our express stuff happens (routes)
const app = require('./server').app;

app.get('/test',(req, res)=>{
    res.json("This is a test route")
})