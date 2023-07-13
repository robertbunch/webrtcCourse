//all our socketServer stuff happens here
const io = require('./server').io;
const app = require('./server').app;
const linkSecret = "ijr2iq34rfeiadsfkjq3ew";
const jwt = require('jsonwebtoken');

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

    const handshakeData = socket.handshake.auth.jwt;
    let decodedData
    try{
        decodedData = jwt.verify(handshakeData,linkSecret);
    }catch(err){
        console.log(err);
        //these arent the droids were looking for. Star wars...
        // goodbye.
        socket.disconnect()
        return
    }
    
    const { fullName, proId } = decodedData;

    if(proId){
        //this is a professional. Update/add to connectedProfessionals
        //check to see if this user is already in connectedProfessionals
        //this would happen because they have reconnected
        const connectedPro = connectedProfessionals.find(cp=>cp.proId === proId)
        if(connectedPro){
            //if they are, then just update the new socket.id
            connectedPro.socketId = socket.id;
        }else{
            //otherwise push them on
            connectedProfessionals.push({
                socketId: socket.id,
                fullName,
                proId
            })
        }
    }else{
        //this is a client
    }

    console.log(connectedProfessionals)

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
