from flask import Flask
from flask_restx import Resource, api
import numpy as np
import cv2
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


@api.route('/api/detect')
class Detect(Resource):
    def post(self, request):
        global file
        logging.info('request', request);
        return { file: file }

if __name__ == '__main__':
    app.run()
