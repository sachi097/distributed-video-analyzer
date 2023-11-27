# Cloud-based-Distributed-Video-Processing-for-Object-Detection

This project was done as part of the course CSCI 5253 : Datacenter Scale Computing offered at CU Boulder. The aim of this Project was to create a distributed processing of video frames for object detection using a pre-trained DNN. By inputting a video into the system, we
will essentially get back a similar video with different objects highlighted and also their count in a
particular frame. These objects could be cars, people or any other object supported by the
pre-trained DNN. This will happen by splitting up the video into individual frames and processing
each of those individual frames. Once the processing is done on the frames, they are merged
back in a way that the original frame order is maintained. Thus, we get the required video with
all the objects and their number highlighted.

# Report and Demo Video
A more detailed report about the Project can be viewed at : [Project_Report](Project_Report.pdf)

Video explanation of the Project along with the Demo can be viewed at [Video_Explanation](Video_Explanation.mp4)

# Steps to run the Project

This project contains

--server.py - run server for distribution and management. Provide the ip address of the server as a command line argument.

--worker.py - run client nodes on user devices. Provide ip addresses of server and the client as a command line argument in that order.

Every client starts as a worker. When the user needs to request processing, type request in the terminal. When you want to finish processing(in case of live stream) type end in the terminal. Type quit to leave.

Commands on client node:

1. request live --> for requesting live stream processing
2. request path-to-video --> for requesting video stream processing
3. end --> to stop processing
4. quit --> to leave

Commands on server node:

1. quit --> to leave
