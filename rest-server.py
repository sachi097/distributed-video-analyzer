##
import jsonpickle
import json
import os
from io import BytesIO
import base64, re
from flask import Flask, request, Response, send_file
from flask_cors import CORS, cross_origin
from google.cloud import storage
from datetime import timedelta

project_id = 'dcsc-project-vidzslayers' 
bucket_name = 'dcsc-project-bucket1'
service_account = os.path.basename('/service-account.json')
print(service_account)
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
    print(content)
    try:
        fileName = content['fileName']
        video_data = content['video']
        print(fileName)
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

@app.route('/queue', methods=['GET'])
def get_from_queue():
    length = redisQueue.llen('toWorker')
    queue = []
    for x in range(0,length):
        print(redisQueue.lindex('toWorker',x).decode())
        queue.append(redisQueue.lindex('toWorker',x).decode())

    response={
        'queue': queue
    }

    response_pickled = jsonpickle.encode(response)
    return Response(response=response_pickled, status=200, mimetype='application/json')

@app.route('/track/<path:hashVal>/<path:audio>', methods=['GET'])
def download_tack_file(hashVal, audio):
    # send requested audio track to client
    audio_data = ''
    filePath = hashVal+'/'+audio+'.mp3'
    available_objects = list(map(
        lambda x: x.object_name,
        minioClient.list_objects(outPutBucketName, hashVal, recursive=True)
    ))

    if(len(available_objects) > 0 and filePath in available_objects):
        try:
            response = minioClient.get_object(outPutBucketName, filePath)
            audio_data = BytesIO(response.data)
        except Exception as e:
            print(e)
        finally:
            response.close()
            response.release_conn()
        return send_file(audio_data, mimetype='audio/mpeg',  download_name='./audio'+'.mp3', as_attachment=True)
    else:
        response={
            'status': 'Failed',
            'reason': 'File do not exist'
        }
        response_pickled = jsonpickle.encode(response)
        return Response(response=response_pickled, status=200, mimetype='application/json')


@app.route('/delete/<path:hashVal>', methods=['Delete'])
def deleteFromRedisAndMinIO(hashVal):
    response = {
        'delete': True, 
        'reason': 'Hash Found'
    }

    # get members of hashVal set
    fileNames = redisHashToName.smembers(hashVal)
    if len(fileNames) == 0:
        response['delete'] = False
        response['reason'] = 'Hash Not Found'
    else:
        # remove track from redis redis i.e. from both redisHashToName and redisNameToHash
        fileNamesToRemove = []
        for fileName in fileNames:
            fileNamesToRemove.append(fileName.decode())
        #remove all values inside hashVal set in redisHashToName
        redisHashToName.srem(hashVal, ','.join(fileNamesToRemove))
        #remove all keys from redisNameToHash
        redisNameToHash.delete(','.join(fileNamesToRemove))

        # remove track from minio
        try:
            delete_objects = map(
                lambda x: x.object_name,
                minioClient.list_objects(outPutBucketName, hashVal, recursive=True)
            )
            for file in delete_objects:
                minioClient.remove_object(outPutBucketName, file)
        except InvalidResponseError as e:
            print(e)

    response_pickled = jsonpickle.encode(response)
    return Response(response=response_pickled, status=200, mimetype='application/json')

app.run(host='0.0.0.0', port=9999)