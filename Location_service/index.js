const express = require('express');
const http = require('http');
const socketIo = require('socket.io');




const { createClient } = require('redis');
const { validateToken } = require('../Location_service/services/authentication');

const client = createClient();

async function init() {

    await client.connect();

}


init();


client.on('error', err => console.log('Redis Client Error', err));



const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static('public'));


io.on('connection', async (socket) => {


    console.log('a user connected', socket.id);

    socket.on("user_connected", async (userId) => {

        const res1 = await client.set(`driver:${socket.id}`, userId);
        if (res1) {
            console.log("successfully inserted");
        } else {
            console.log("error in insertion")
        }
    })

    socket.on("completed", async (Ambulance) => {


        const res5 = await client.sIsMember('Complete_source', `${Ambulance}`)
        console.log(res5)
        if (res2 == false) {
            const res1 = await client.sAdd('Complete_source', `${Ambulance}`)
            console.log(res1)
            let data = await client.get(`book:${Ambulance}`);

            if (data) {
                data = JSON.parse(data)

                const x = {
                    latitude: data.HospitalLatitude,
                    longitude: data.HospitalLongitude
                }
                socket.emit("destinationLocation", x);
                // console.log(data)
            }


        }
        else {

            const member = await client.get(`driver:${socket.id}`);


            const Mem = `Ambulance:${Ambulance}-DriverId:${member}`
            console.log(Mem)

            key = 'Ambulance:rentable'
            const result = await client.zRem(key, member); // Remove the member from the geospatial set
            await client.del(`Complete_source:${Ambulance}`)
            console.log(`Removed ${member} from geohash set:`, result);
        }

    })


    socket.on('update', async (body) => {


        let { latitude, longitude, Ambulance } = body;



        latitude = parseFloat(latitude)
        longitude = parseFloat(longitude)

        let data = await client.get(`book:${Ambulance}`);
        console.log("data--->", data);




        if (data) {
            data = JSON.parse(data)

            console.log(data, data.RiderLatitude)

            const x = {
                latitude: data.RiderLatitude,
                longitude: data.RiderLongitude


            }
            console.log("find the data --> Rider", x.latitude, x.longitude)
            socket.emit("destinationLocation", x);
            // console.log(data)
        }
        const member = await client.get(`driver:${socket.id}`);


        const Mem = `Ambulance:${Ambulance}-DriverId:${member}`
        console.log(Mem)

        key = 'Ambulance:rentable'


        try {
            const result = await client.geoAdd(key, {
                longitude,
                latitude,
                member: Mem
            });
            console.log("successfully inserted")
        }
        catch (err) {
            console.log(err)
        }




    })
})

// Start the server
server.listen(3000, () => {
    console.log('listening on *:3000');
})
