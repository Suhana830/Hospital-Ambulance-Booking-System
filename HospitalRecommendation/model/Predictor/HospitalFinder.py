import pickle
import re
import pandas as pd
import numpy as np
import sys

class HospitalFinder:
    def __init__(self):
        self.clf=pickle.load(open("./model/Predictor/hospital_classifier.pkl","rb"))
        self.cv=pickle.load(open("./model/Predictor/count_vectorizer.pkl","rb"))
        self.suburbs=[]
        self.get_hospital_names()
    def get_hospital_names(self):
        suburbs = []
        subs = open('./model/Predictor/areas.txt', 'r')
        for line in subs:
            line = line.replace('(', '')
            line = line.replace(')', '')
            line = line.strip()
            suburbs.append(line)
        self.suburbs=suburbs
        subs.close()
    def find_services(self, txt, services):
        ortho = re.search("[a-z].*[oO]rtho*", txt)
        pedia = re.search("[a-z].*[pP]edia*", txt)
        cardio = re.search("[a-z].*[cC]ardio*", txt)
        derma = re.search("[a-z].*[dD]erma*", txt)
        endo = re.search("[a-z].*[eE]ndo*", txt)
        gastro = re.search("[a-z].*[gG]astro*", txt)
        nephro = re.search("[a-z].*[nN]ephro*", txt)
        neuro = re.search("[a-z].*[nN]euro*", txt)
        onco = re.search("[a-z].*[oO]nco*", txt)
        optha = re.search("[a-z].*[oO]ptha*", txt)
        vaccine = re.search("[a-z].*[vV]accin*", txt)

        if ortho:
            services.append("orthopedic")
        if pedia:
            services.append("pediatric")
        if cardio:
            services.append("cardiology")
        if derma:
            services.append("dermatology")
        if endo:
            services.append("endocrinology")
        if gastro:
            services.append("gastrology")
        if nephro:
            services.append("nephrology")
        if neuro:
            services.append("neurology")
        if onco:
            services.append("oncology")
        if optha:
            services.append("opthalogy")
        if vaccine:
            services.append("vaccination")

        return services
    def recommend_hospital(self, lat,lon,ran,speciality):

        change_per_deg_lat = 111.2
        change_per_deg_long = 105.75
        hospi = []
        Hospitals={}
        specialist={}
        df = pd.read_csv("./model/Predictor/modified.csv")

        for row in df.itertuples():

            x = abs(float(row[6]) - lon) * change_per_deg_long
            y = abs(float(row[5]) - lat) * change_per_deg_lat
            dist = (x**2 + y**2)**(1/2)
            
            if dist <= ran:
                # print(row[1])
                try:
                    dict= {}
                    if row[1] not in self.suburbs:
                        continue
                    # print("Here")
                    process = pd.read_csv("./model/Predictor/Reviews/"+str(row[1])+"/processed_reviews.csv")
#                     print("./Reviews/"+str(row[1])+"/reviews.csv")
                    pointer = open("./model/Predictor/Reviews/"+str(row[1])+"/processed_reviews.csv", "r")
                    txt = pointer.read()
                    service = []
                    dict["hospital"] = str(row[1])

                    services = self.find_services(txt, service)
                    data = process['Review'].to_list()
                    vect = self.cv.transform(data).toarray()

                    my_prediction = self.clf.predict(vect)
                    flag = "Bad"
                    good_reviews = np.count_nonzero(my_prediction) / len(my_prediction)
                    Hospitals[str(row[1])] = good_reviews

                    if speciality in services:
                        specialist[str(row[1])] = speciality


                    # print(good_reviews)
                    # print(np.count_nonzero(my_prediction))
                    # print(speciality)

                    if good_reviews > 0.5:
                        flag = "Good"
                    if (good_reviews > 0.75) & (len(my_prediction) > 100):
                        flag = "Excellent"
                    if good_reviews <= 0.5:
                        flag = "Not good"
                    # print(my_prediction)

                    sys.stdout.write("\033[1;35m")
                    if flag == "Good":
                        if speciality in services:
                                sys.stdout.write("\033[1;32m")
                                dict["msg"] = str(row[1])+" is a",flag,"hospital for",speciality
                                print("\n"+str(row[1])+" is a",flag,"hospital for",speciality)
                    elif flag == "Excellent":
                        if speciality in services:
                                dict["msg"] = "We recommend " + str(row[1])+ " for" + speciality +",it is an",flag,"hospital"
                                print("\nWe recommend "+str(row[1])+" for",speciality,",it is an",flag,"hospital")
                    sys.stdout.write("\033[1;33m")
                    dict["speciality"] = speciality
                    dict["lat"]=row[5]
                    dict["long"]=row[6]
                    if speciality in services:
                        print("Here, the specialities offered are ")
                        print(services)
#                     print("H")
                    hospi.append(dict)
                    sys.stdout.write("\033[0;0m")
                    
                except:
                    continue

        return hospi
        
# hf=HospitalFinder()
# res=hf.recommend_hospital(18,73,10000,"pediatric")
# print(res)