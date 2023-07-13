//all our socketServer stuff happens here
const io = require('./server').io;
const app = require('./server').app;
const linkSecret = "ijr2iq34rfeiadsfkjq3ew";

// const professionalAppointments = app.get('professionalAppointments')

const connectedProfessionals = [];

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

    //to fill in later
    const jwt = socket.handshake.auth.jwt;
    let decodedData;
    try{
        decodedData = jwt.verify(jwt,linkSecret);
    }catch(err){
        //these aren't the droids we're looking for, goodbye.
        socket.disconnect(true);
        return;
    }

    const { fullName, proId } = decodedData;

    connectedProfessionals.push({
        socketId: socket.id,
        fullName: fullName,
        proId,
    })

    socket.on('newOffer',({offer, apptInfo})=>{
        //offer = sdp/type, apptInfo has the uuid that we can add to allKnownOffers
        //so that, the professional can find EXACTLY the right allKnownOffers
        allKnownOffers[apptInfo.uuid] = {
            ...apptInfo,
            offer,
            offererIceCandidates: [],
            answer: null,
            answerIceCandidates: [],
        }
        //we dont emit this to everyone like we did our chat server
        //we only want this to go to our professional.
        const p = connectedProfessionals.find(cp=>cp.fullName === apptInfo.professionalsFullName)
        if(p){
            //only emit if the professional is connected
            const socketId = p.socketId;
            socket.to(socketId).emit('newOfferWaiting',allKnownOffers[apptInfo.uuid])
        }
    })
})
