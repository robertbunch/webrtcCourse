//all our socketServer stuff happens here
const io = require('./server').io;
const app = require('./server').app;

// const professionalAppointments = app.get('professionalAppointments')

const allKnownOffers = {
    // uniqueId - key
    //offer
    //professionalsFullName
    //clientName
    //apptDate
    //offererIceCandidates
    //answer
    //answerIceCandidates
};

io.on('connection',socket=>{
    console.log(socket.id,"has connected")
    socket.on('newOffer',({offer, apptInfo})=>{
        //offer = sdp/type, apptInfo has the uuid that we can add to allKnownOffers
        //so that, the professional can find EXACTLY the right allKnownOffers
    })
})
