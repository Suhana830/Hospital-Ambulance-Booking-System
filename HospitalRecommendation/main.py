from flask import Flask,request,render_template ,jsonify,redirect
import requests
from model.Predictor.HospitalFinder import HospitalFinder
app = Flask(__name__)
import pandas as pd


@app.route('/')
def blog():
    return render_template('home.html')

@app.route('/get-hospital',methods=['POST','GET'])
def predict():
    if request.method == 'POST':
        print(dir(request))
        received_data = request.form
        latitude = float(received_data.get("Latitude",0))
        longitude = float(received_data.get("Longitude",0))
        ran = 10000000
        speciality = received_data.get("speciality","")
        # print(latitude," ",longitude," ",speciality)
        print(received_data)
        hospital_finder=HospitalFinder()
        data=hospital_finder.recommend_hospital(latitude,longitude,ran, speciality)

        

        # data = [
        #          { "name": "a", "distance": "12km", "speciality": "itching cought" ,"msg":"hello1 "},
        #         ]

        return jsonify(data)

        





if __name__ == "__main__":
    app.run(debug=True,port=8050)