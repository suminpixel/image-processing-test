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

    # Log Time
    detect_start_time = time.time()

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    # Draw rectangle around the faces and crop the faces
    for (x, y, w, h) in faces:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)
        faces = img[y:y + h, x:x + w]
        # cv2.imshow("face", faces)
        cv2.imwrite('./static/face.jpg', faces)

    detect_time = time.time() - detect_start_time

    # Display the output
    cv2.imwrite('./static/detected.jpg', img)

    return {'detect_time': detect_time  * 1000}

@api.route('/hello')  # 데코레이터 이용, '/hello' 경로에 클래스 등록
class HelloWorld(Resource):
    def get(self):  # GET 요청시 리턴 값에 해당 하는 dict를 JSON 형태로 반환
        return {"hello": "world!"}


@api.route('/detect')
class Detect(Resource):
    def post(self):
        global file
        file = request.json.get('data')

        return {
            'file': file
        }

@api.route('/api/detect')
class Detect(Resource):
    def post(self):

        # normal file
        function_start_time = time.time()
        picture = request.files['file'].read()
        normal_result = face_detect(picture)
        function_time = time.time() - function_start_time
        normal_result.update({'function_time': function_time * 1000})

        # pre file
        function_start_time = time.time()
        picture = request.files['pre_file'].read()
        pre_result = face_detect(picture)
        function_time = time.time() - function_start_time
        pre_result.update({'function_time': function_time * 1000})

        return [ normal_result, pre_result ]

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
