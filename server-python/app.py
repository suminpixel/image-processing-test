from flask import Flask, request, jsonify
from flask_restx import Resource, Api
from flask_cors import CORS, cross_origin
import numpy
import cv2
import logging
import time
import psutil

app = Flask(__name__)
api = Api(app)
CORS(app, resources={r'*': {'origins': '*'}})

logging.basicConfig(level=logging.INFO)

def pre_face_detect(a):
    # Log Time
    detect_start_time = time.time()

    # print(picture)
    # convert string data to numpy array
    numpy_img_str = numpy.fromstring(a, numpy.uint8)
    # convert numpy array to image
    img = cv2.imdecode(numpy_img_str, cv2.IMREAD_UNCHANGED)
    cv2.imwrite('./static/target_pre.jpg', img)

    # Read the input image
    img = cv2.imread('./static/target_pre.jpg')

    # Convert into grayscale
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Load the cascade
    face_cascade = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml')

    # Detect faces
    faces = face_cascade.detectMultiScale(img, 1.1, 4)
    logging.info(faces)

    list_str = faces.tolist()

    detect_time = time.time() - detect_start_time

    cpu_p = psutil.cpu_percent()

    return { 'time': detect_time, 'faces': list_str, 'cpu': cpu_p }

def face_detect(a):
    # Log Time
    detect_start_time = time.time()

    # print(picture)
    # convert string data to numpy array
    numpy_img_str = numpy.fromstring(a, numpy.uint8)
    # convert numpy array to image
    img = cv2.imdecode(numpy_img_str, cv2.IMREAD_UNCHANGED)
    cv2.imwrite('./static/target.jpg', img)

    # Read the input image
    img = cv2.imread('./static/target.jpg')

    # Convert into grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Load the cascade
    face_cascade = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml')

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    logging.info(faces)
    # Draw rectangle around the faces and crop the faces
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
        faces = img[y:y + h, x:x + w]
        # cv2.imshow("face", faces)
        cv2.imwrite('./static/face.jpg', faces)


    # Display the output
    cv2.imwrite('./static/detected.jpg', img)

    list_str = faces.tolist()

    detect_time = time.time() - detect_start_time

    cpu_p = psutil.cpu_percent()

    return { 'time': detect_time, 'faces': list_str, 'cpu': cpu_p }


@api.route('/hello')  # ??????????????? ??????, '/hello' ????????? ????????? ??????
class HelloWorld(Resource):
    def get(self):  # GET ????????? ?????? ?????? ?????? ?????? dict??? JSON ????????? ??????
        return {"hello": "world!"}

@api.route('/api/detect')
class Detect(Resource):
    def post(self):

        normal_time_list = []
        pre_time_list = []

        count = request.form['count']
        picture = request.files['file'].read()
        pre_picture = request.files['pre_file'].read()

        # normal file
        for _ in range(int(count)):
            normal_result = face_detect(picture)
            normal_time_list.append(normal_result)

        normal_avg = numpy.mean(normal_time_list) * 1000
        normal_median = numpy.median(normal_time_list) * 1000

        # pre file
        for _ in range(int(count)):
            pre_result = face_detect(pre_picture)
            pre_time_list.append(pre_result)

        pre_avg = numpy.mean(pre_time_list) * 1000
        pre_median = numpy.median(pre_time_list) * 1000

        return [ {'Average': normal_avg , 'Median': normal_median }, {'Average': pre_avg , 'Median': pre_median } ]


@api.route('/api/detect/face')
class Detect(Resource):
    def post(self):

        time_list = []
        cpu_list = []

        count = request.form['count']
        picture = request.files['file'].read()

        face_detect(picture)
        for _ in range(int(count)):
            normal_result = face_detect(picture)
            time_list.append(normal_result['time'])
            cpu_list.append(normal_result['cpu'])

        time_avg = numpy.mean(time_list) * 1000
        time_median = numpy.median(time_list) * 1000
        cpu_avg = numpy.mean(cpu_list)
        cpu_i = psutil.cpu_count()

        return {'Average': time_avg , 'Median': time_median, 'Url': '/static/detected.jpg', 'CPUPercent': cpu_avg, 'CPUInfo': cpu_i }

@api.route('/api/detect/face/pre')
class Detect(Resource):
    def post(self):

        time_list = []
        cpu_list = []

        count = request.form['count']
        picture = request.files['file'].read()

        faces_result = pre_face_detect(picture)['faces']
        logging.info(faces_result)
        for _ in range(int(count)):
            normal_result = pre_face_detect(picture)
            time_list.append(normal_result['time'])
            cpu_list.append(normal_result['cpu'])

        time_avg = numpy.mean(time_list) * 1000
        time_median = numpy.median(time_list) * 1000
        cpu_avg = numpy.mean(cpu_list)
        cpu_i = psutil.cpu_count()

        return {'Average': time_avg , 'Median': time_median, 'Faces': faces_result, 'CPUPercent': cpu_avg, 'CPUInfo': cpu_i }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
