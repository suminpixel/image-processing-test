from flask import Flask, request, jsonify
from flask_restx import Resource, Api
from flask_cors import CORS, cross_origin
import numpy
import cv2
import logging
import time

app = Flask(__name__)
api = Api(app)
CORS(app, resources={r'*': {'origins': '*'}})

logging.basicConfig(level=logging.INFO)

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

    # Draw rectangle around the faces and crop the faces
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
        faces = img[y:y + h, x:x + w]
        # cv2.imshow("face", faces)
        cv2.imwrite('./static/face.jpg', faces)


    # Display the output
    cv2.imwrite('./static/detected.jpg', img)

    detect_time = time.time() - detect_start_time

    return { 'time': detect_time, 'faces': faces}

@api.route('/hello')  # 데코레이터 이용, '/hello' 경로에 클래스 등록
class HelloWorld(Resource):
    def get(self):  # GET 요청시 리턴 값에 해당 하는 dict를 JSON 형태로 반환
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

        count = request.form['count']
        picture = request.files['file'].read()

        face_detect(picture)
        for _ in range(int(count)):
            normal_result = face_detect(picture)
            time_list.append(normal_result['time'])

        time_avg = numpy.mean(time_list) * 1000
        time_median = numpy.median(time_list) * 1000

        return {'Average': time_avg , 'Median': time_median, 'Url': '/static/detected.jpg'}

@api.route('/api/detect/face/pre')
class Detect(Resource):
    def post(self):

        time_list = []

        count = request.form['count']
        picture = request.files['file'].read()

        faces = face_detect(picture)['faces']
        for _ in range(int(count)):
            normal_result = face_detect(picture)
            time_list.append(normal_result['time'])

        time_avg = numpy.mean(time_list) * 1000
        time_median = numpy.median(time_list) * 1000

        return {'Average': time_avg , 'Median': time_median, 'Faces': faces }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
