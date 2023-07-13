//all our socketServer stuff happens here
const io = require('./server').io;
const app = require('./server').app;

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
    const fullName = socket.handshake.auth.fullName

    connectedProfessionals.push({
        socketId: socket.id,
        fullName: fullName,
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
