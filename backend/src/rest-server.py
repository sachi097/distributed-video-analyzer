##
import jsonpickle
import json
import os
from io import BytesIO
import base64, re
from flask import Flask, request, Response, send_file
from flask_cors import CORS, cross_origin
from google.cloud import storage

project_id = 'dcsc-project-vidzslayers' 
bucket_name = 'dcsc-project-bucket1'
service_account = os.path.basename('/service-account.json')
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]= service_account

client = storage.Client(project_id)
# Create a bucket object for our bucket
bucket = client.get_bucket(bucket_name)


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Added this for health checking
@app.route('/', methods=['GET'])
def hello():
    return 'Added this, for health checking'
# When the Music filename is provided for separation
@app.route('/uploadVideo', methods=['POST'])
@cross_origin()
def uploadVideo():
    content = request.get_json()
    try:
        fileName = content['fileName']
        video_data = content['video']
        regex = r"(?<=data:)(.*)(?=;)"
        split = video_data.split('base64')
        format_video = re.findall(regex, split[0])[0]
        base64_video = base64.b64decode(split[1])
        blob = bucket.blob(fileName)
        blob.upload_from_string(base64_video, content_type=format_video)
        blob.make_public()
        response={
            'videoUrl': 'https://storage.googleapis.com/'+bucket_name+'/'+fileName
        }
        response_pickled = jsonpickle.encode(response)
        return Response(response=response_pickled, status=200, mimetype="application/json")
    except Exception as e:
        print(e)

@app.route('/processVideo', methods=['POST'])
@cross_origin()
def get_from_queue():
    content = request.get_json()
    try:
        originalVideoUrl = content['originalVideoUrl']
        os.system('python3 client.py 10.138.0.20 10.138.0.21 '+originalVideoUrl) # change ip addresses based on the ip address of master node and client node
        response={
            'processedVideoUrl':'https://storage.googleapis.com/'+bucket_name+'/processedVideo.mp4'
        }
        response_pickled = jsonpickle.encode(response)
        return Response(response=response_pickled, status=200, mimetype='application/json')
    except Exception as e:
        print(e)

app.run(host='0.0.0.0', port=9999)