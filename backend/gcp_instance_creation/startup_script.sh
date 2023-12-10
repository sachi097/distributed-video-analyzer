#!/bin/bash
# # [START startup_script]
sudo apt-get update
sudo apt-get install -y python3 python3-pip git libgl1 python3-opencv

sudo pip3 install -e .
sudo pip3 install flask 
sudo pip3 install pillow 
sudo pip3 install jsonpickle
sudo pip3 install imagezmq
sudo pip3 install imutils
sudo pip3 install numpy
sudo pip3 install flask-cors
sudo pip3 install gcloud
sudo pip3 install --upgrade google-cloud-storage
