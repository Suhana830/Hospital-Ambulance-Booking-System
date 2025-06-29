from flask import Flask,request,render_template ,jsonify,redirect
import requests
app = Flask(__name__)

@app.route('/')
def blog():
    return render_template('home.html')

@app.route('/get-hospital',methods=['POST','GET'])
def predict():
    if request.method == 'POST':

        received_data = request.json
        # latitude = received_data.Latitude
        # longitude = received_data.Longitude
        # ran = 10000000
        # speciality = received_data.speciality
        # print(latitude," ",longitude," ",speciality)
        print(received_data)

        data = [
                 { "name": "a", "distance": "12km", "speciality": "cfd, igf" ,"msg":"hello1 "},
                 { "name": "b", "distance": "11km", "speciality": "nfd, igf","msg":"hello2 " }
        ]

        return jsonify(data)

        





if __name__ == "__main__":
    app.run(debug=True,port=8050)