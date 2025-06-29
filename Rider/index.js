const express = require('express')
const StaticRouter = require('./router/stat.js')
const cookieParser = require('cookie-parser')
const path = require("path")
const axios = require('axios');
const mongoose = require("mongoose");
const { validateToken } = require('./services/authentication.js');
const { CreateSourceLocation } = require('./services/SaveLocations.js');
const journey = require("./models/journey.js")


const { createClient } = require('redis');
const client = createClient();

async function init() {


    await client.connect();
}

init();
// console.log(client);


client.on('error', err => console.log('Redis Client Error', err));


const app = express()
app.use(express.json());
app.set("view engine", "ejs");
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("./images")))



const uri = "mongodb+srv://suhanagupta809036:XRqNUwIajT5Eb58T@cluster0.xnlfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
console.log(uri);


mongoose.connect(uri).catch((err) => console.log(err));



app.use("/Rider", StaticRouter);

app.post("/createBooking", async (req, res) => {

    const { DriverId, AmbulanceNum } = req.body;



    const userRider_ = req.cookies['riderLocation'];

    const TokenCookieValue = req.cookies['token'];
    const decode = validateToken(TokenCookieValue);



    const HospitalToken = req.cookies['HospitalToken'];


    const DriverInfo = {
        Ambulance: AmbulanceNum,
        DriverId: DriverId
    }




    const trip = new journey({

        RiderId: decode._id,
        DriverId: DriverId,
        RiderLatitude: userRider_.Longitude,
        RiderLongitude: userRider_.Latitude,
        AmbulanceNumber: AmbulanceNum,
        HospitalLatitude: HospitalToken.latitude,
        HospitalLongitude: HospitalToken.longitude


    });

    const savedtrip = await trip.save();

    const payload = {
        RiderLatitude: userRider_.Longitude,
        RiderLongitude: userRider_.Latitude,
        HospitalLatitude: HospitalToken.latitude,
        HospiatlLongitude: HospitalToken.longitude,
        tripId: savedtrip._id
    }

    console.log("saved trip", savedtrip);

    // Acknowledge the request without redirecting
    /*......................*/
    try {
        await client.set(
            `book:${AmbulanceNum}`,
            JSON.stringify(payload) // Store as a JSON string
        );

        // res.status(200).render("Map", { RiderLocation: userRider_, HospitalLocation: HospitalToken })
        // return res.cookie("DriverInfo", DriverInfo).render('Map', {
        //     RiderLocation: { longitude: userRider_.longitude, latitude: userRider_.latitude },
        //     HospitalLocation: { longitude: HospitalToken.longitude, latitude: HospitalToken.latitude }
        // });

        // return res.cookie("DriverInfo", DriverInfo).render('Driver_sourceMap', {
        //     RiderLocation: { longitude: userRider_.longitude, latitude: userRider_.latitude },
        //     HospitalLocation: { longitude: HospitalToken.longitude, latitude: HospitalToken.latitude }
        // });


        return res.cookie("DriverInfo", DriverInfo).render('successfullPage', {
            RiderLocation: { longitude: userRider_.longitude, latitude: userRider_.latitude },
            HospitalLocation: { longitude: HospitalToken.longitude, latitude: HospitalToken.latitude }
        });
    } catch (error) {
        console.error('Error storing location:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }

})

app.post("/driver-location", async (req, res) => {
    let { Ambulance, member } = req.body
    member = `Ambulance:${Ambulance}-DriverId:${member}`
    console.log(member)

    key = 'Ambulance:rentable'


    try {
        const position = await client.geoPos(key, member); // Retrieve the position of the member
        if (position && position[0]) {
            let longitude = position[0].latitude;
            let latitude = position[0].longitude;
            console.log("--->", position[0].latitude)


            // Update Ambulance Marker
            latitude = parseFloat(parseFloat(latitude).toFixed(6));
            longitude = parseFloat(parseFloat(longitude).toFixed(6));



            return res.send({ longitude: longitude, latitude: latitude });
        } else {
            console.log(`Member ${member} not found in the key ${key}`);
        }
    } catch (err) {
        console.error("Error retrieving geolocation for member:", err);
    }



})

app.post("/get-driver", async (req, res) => {

    const hospitalItems = req.body;
    // console.log("hospitalDetail is : ", hospitalItems);

    const userRider_ = req.cookies['riderLocation'];


    const HospitalToken = {
        latitude: hospitalItems.latitude,
        longitude: hospitalItems.longitude,
        hospital_name: hospitalItems.name,
    }



    const { Longitude, Latitude } = userRider_;



    const res4 = await client.geoSearchWith(
        'Ambulance:rentable',



        // { longitude: -122.2612767, latitude: 37.7936847 },
        { longitude: Longitude, latitude: Latitude },
        { radius: 10000, unit: 'km' },
        ['WITHDIST']
    )
    console.log("driver--->", res4)


    // console.log("hospitaltoken ", HospitalToken)
    // return res.send("hello")
    return res.cookie("HospitalToken", HospitalToken).render("findAmb", { amb: res4 });
});

app.get('/driver/map', (req, res) => {
    const { riderLat, riderLong, hospitalLat, hospitalLong } = req.query;

    res.render('Driver_sourceMap', {
        RiderLocation: { latitude: riderLat, longitude: riderLong },
        HospitalLocation: { latitude: hospitalLat, longitude: hospitalLong },
    });
});


app.post("/get-hospi", async (req, res) => {

    let { Latitude, Longitude, speciality } = req.body; // Data from the client request
    Latitude = parseFloat(Latitude)
    Longitude = parseFloat(Longitude)

    dataToSend = {
        Latitude: Latitude,
        Longitude: Longitude,
        speciality: speciality
    }
    const data = new FormData()
    data.append('Latitude', Latitude)
    data.append('Longitude', Longitude)
    data.append('speciality', speciality)


    try {

        // const flaskServerUrl = 'http://localhost:5000/get-hospital'
        const flaskServerUrl = 'http://127.0.0.1:8050/get-hospital'

        const resp = await fetch(flaskServerUrl, {
            method: "POST",
            body: data
        })

        const result = await resp.json();
        console.log(result);

        // const flaskData = flaskResponse.data;
        // return {};
        return res.cookie("riderLocation", dataToSend).render("book_hosp", { flaskData: result });


    } catch (error) {
        console.error('Error communicating with Flask server:', error.message);
        res.status(500).json({ status: 'error', message: 'Failed to process request' });
    }
    // return res.render("findAmb");
})


app.listen(8033, () => {
    console.log("running at port 8033");
})
