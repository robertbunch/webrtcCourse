//all our socketServer stuff happens here
const io = require('./server').io;
const app = require('./server').app;
const linkSecret = "ijr2iq34rfeiadsfkjq3ew";
const jwt = require('jsonwebtoken');

// const professionalAppointments = app.get('professionalAppointments')

const connectedProfessionals = [];
const connectedClients = [];

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
        //send the appt data out to the professional
        const professionalAppointments = app.get('professionalAppointments');
        socket.emit('apptData',professionalAppointments.filter(pa=>pa.professionalsFullName === fullName))
        
        //loop through all known offers and send out to the professional that just joined, 
        //the ones that belong to him/her
        for(const key in allKnownOffers){
            if(allKnownOffers[key].professionalsFullName === fullName){
                //this offer is for this pro
                io.to(socket.id).emit('newOfferWaiting',allKnownOffers[key])
            }
        }
    }else{
        //this is a client
        const { professionalsFullName, uuid, clientName } = decodedData;
        //check to see if the client is already in the array
        //why? could have reconnected
        const clientExist = connectedClients.find(c=>c.uuid == uuid)
        if(clientExist){
            //already connected. just update the id
            clientExist.socketId = socket.id
        }else{
            //add them
            connectedClients.push({
                clientName,
                uuid,
                professionalMeetingWith: professionalsFullName,
                socketId: socket.id,
            })    
        }

        const offerForThisClient = allKnownOffers[uuid];
        if(offerForThisClient){
            io.to(socket.id).emit('answerToClient',offerForThisClient.answer);
        }

    }

    console.log(connectedProfessionals)

    socket.on('newAnswer',({answer,uuid})=>{
        //emit this to the client
        const socketToSendTo = connectedClients.find(c=>c.uuid == uuid);
        if(socketToSendTo){
            socket.to(socketToSendTo.socketId).emit('answerToClient',answer);
        }
        //update the offer
        const knownOffer = allKnownOffers[uuid];
        if(knownOffer){
            knownOffer.answer = answer;
        }

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

        //we got professionalAppointments from express (thats where its made)
        const professionalAppointments = app.get('professionalAppointments');
        //find this particular appt so we can update that the user is waiting (has sent us an offer)
        const pa = professionalAppointments.find(pa=>pa.uuid === apptInfo.uuid);
        if(pa){
            pa.waiting = true;
        }

        //find this particular professional so we can emit
        const p = connectedProfessionals.find(cp=>cp.fullName === apptInfo.professionalsFullName)
        if(p){
            //only emit if the professional is connected
            const socketId = p.socketId;
            //send the new offer over
            socket.to(socketId).emit('newOfferWaiting',allKnownOffers[apptInfo.uuid])
            //send the updated appt info with the new waiting
            socket.to(socketId).emit('apptData',professionalAppointments.filter(pa=>pa.professionalsFullName === apptInfo.professionalsFullName))
        }
    })

    socket.on('getIce',(uuid,who,ackFunc)=>{
        const offer = allKnownOffers[uuid];
        // console.log(offer)
        let iceCandidates = [];
        if(offer){
            if(who === "professional"){
                iceCandidates = offer.offererIceCandidates
            }else if(who === "client"){
                iceCandidates = offer.answerIceCandidates;
            }
            ackFunc(iceCandidates)
        }
    })

    socket.on('iceToServer',({who,iceC,uuid})=>{
        console.log("==============",who)
        const offerToUpdate = allKnownOffers[uuid];
        if(offerToUpdate){
            if(who === "client"){
                //this means the client has sent up an iceC
                //update the offer
                offerToUpdate.offererIceCandidates.push(iceC)
                const socketToSendTo = connectedProfessionals.find(cp=>cp.fullName === decodedData.professionalsFullName)
                if(socketToSendTo){
                    socket.to(socketToSendTo.socketId).emit('iceToClient',iceC);
                }
            }else if(who === "professional"){
                offerToUpdate.answerIceCandidates.push(iceC)
                const socketToSendTo = connectedClients.find(cp=>cp.uuid == uuid)
                if(socketToSendTo){
                    socket.to(socketToSendTo.socketId).emit('iceToClient',iceC);
                }
            }
        }
    })
})
