# Analysis of Video in Distributed Environment for Object Detection

This project was done as part of the course CSCI 5253 : Datacenter Scale Computing offered at CU Boulder (Fall 2023). The aim of this Project was to create a distributed processing of video frames for object detection using a pre-trained DNN. By inputting a video into the system, we will essentially get back a similar video with different objects highlighted and also their count in a particular frame. These objects could be cars, people or any other object supported by the pre-trained DNN. This will happen by splitting up the video into individual frames and processing
each of those individual frames. Once the processing is done on the frames, they are merged back in a way that the original frame order is maintained. Thus, we get the required video with
all the objects and their number highlighted.


# Steps to run the Project

This project contains

```
-frontend
 -react_app
-backend
 -gcp_instance_creation
 -src
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

# Instructions on using system without frontend

--server.py - run server for distribution and management. Provide the ip address of the server as a command line argument. For example look "At master node" section

--worker.py - run client nodes on user devices. Provide ip addresses of server and the client as a command line argument in that order. For example look "At worker node" section

Every client starts as a worker. When the user needs to request processing, type request in the terminal. When you want to finish processing(in case of live stream) type end in the terminal. Type quit to leave.

Commands on client node:

1. request live --> for requesting live stream processing
2. request path-to-video --> for requesting video stream processing
3. end --> to stop processing
4. quit --> to leave

Commands on server node:

1. quit --> to leave

# Team - VidzSlayers