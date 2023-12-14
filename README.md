# Final Project Repository

# Team - VidzSlayers
Members: Anirudh Prashant Kalghatkar and Sachin Kashinath Rathod

# Video Explanation
[Video - Analysis of Video in Distributed Environment for Object Detection](https://drive.google.com/file/d/1IxoJAZESDcj8YCw4uFTVuRT-HmayR6_Z/view?usp=sharing)

# Analysis of Video in Distributed Environment for Object Detection

As part of the CSCI 5253: Datacenter Scale Computing course at the University of Colorado, Boulder (Fall 2023), our project focused on implementing a distributed video frame processing system for Object detection using a pre-trained Deep Neural Network (DNN). The objective was to input a video into the system and receive an output video where various objects are highlighted, along with their count in each frame where the objects can be cars,people or any other object supported by pre-trained DNN.This was achieved by dividing the video into individual frames, independently processing each frame for object detection using the pre-trained DNN, and then merging the frames while maintaining the original order. The outcome is a modified video with highlighted objects and their respective counts. The project leverages distributed processing for scalability and efficiency, contributing to the intersection of datacenter scale computing, deep learning, and video analytics.

For this project we have configured pre-trained DNN to detect humans.

# Steps to run the Project

This project contains

```
-backend
 -gcp_instance_creation
 -src
-frontend
 -vidzslayers
```

# Instructions on setting up backend

Step 1
```
cd backend
cd gcp_instance_creation
python3 gcp_instance.py gcp_project_id bucket_name --zone='zone' --name='instance_name'
ex: python3 gcp_instance.py dcsc-project-vidzslayers master-bucket --zone='us-west1-b' --name='master'
# run the above command for each node you want to create i.e. client, worker1, worker2, ..., etc.
cd ..
```
Step 2
```
cd src

# At master node
python3 server.py internal_ip_address_of_master_node
ex: python3 server.py 10.138.0.10

# At worker node
python3 worker.py internal_ip_address_of_master_node internal_ip_address_of_worker_node
ex: python3 worker.py 10.138.0.10 10.138.0.16

# At client node
python3 rest-server.py
```

# Instructions on setting up frontend
Step 1
```
cd frontend
cd vidzslayers
npm install
npm start
```

# Instructions on using system without frontend

--server.py - run server for distribution and management. Provide the ip address of the server as a command line argument. For example look "At master node" section above

--worker.py - run client nodes on user devices. Provide ip addresses of server and the client as a command line argument in that order. For example look "At worker node" section above

Every client starts as a worker. When the user needs to request processing, type request in the terminal. When you want to finish processing(in case of live stream) type end in the terminal. Type quit to leave.

Commands on client node:

1. request live --> for requesting live stream processing
2. request url-path-to-video --> for requesting video stream processing
3. end --> to stop processing
4. quit --> to leave

Commands on server node:

1. quit --> to leave