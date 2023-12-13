import React, { useState } from "react";
import ReactPlayer from "react-player";
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [originalVideoUrl, setOriginalVideoUrl] = useState("");
  const [processComplete, setProcessComplete] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalyzeButton, setShowAnalyzeButton] = useState(false);
  const [showUploadProgressBar,setShowUploadProgressBar ] = useState(false);
  const [processedVideoUrl, setProcessedVideoUrl] = useState("");
  const [showOriginalVideoPlayer, setShowOriginalVideoPlayer] = useState(false);

  const convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const bloburl = URL.createObjectURL(selectedFile)
    let blob = await fetch(bloburl).then(r => r.blob());
    var blobfile = new File([blob], "OriginalVideo.mp4", { type: "video/mp4", lastModified: new Date().getTime() })
    convertBlobToBase64(blobfile).then((data) => {
      setFile(data)
    });
    console.log(convertBlobToBase64(blobfile))

  };

  //upload function

  const handleUpload = async () => {

    if (!file) {
      alert("Please choose a file");
      return;
    }
    setUploading(true);
    setShowUploadProgressBar(true);
    setTimeout(() => { }, 2000)
    const fileName = "OriginalVideo.mp4"

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress < 90) {
          return prevProgress + 10;
        } else if (prevProgress > 80 && prevProgress < 95) {
          return 90;

        }


      });
    }, 500);

    axios.post(

      "http://34.83.59.182:9999/uploadVideo",
      {
        video: file,
        fileName: fileName
      },
      {
        'content-type': 'application/json'
      }).then(function (response) {
        console.log(response.data.videoUrl)
        setOriginalVideoUrl(response.data.videoUrl)
        setUploadComplete(true);
        console.log("Hello")
        setShowDeleteButton(true);
        setShowAnalyzeButton(true);
        setUploading(false);
        setShowUploadProgressBar(false)
        setShowAnalyzeButton(true);
        clearInterval(interval)
        setShowOriginalVideoPlayer(true);
      }).catch(function (error) {

        console.log(error)
      });

  };


  //handle delete function
  const handleDelete = () => {
    setDeleting(true);
    // Simulating delete progress
    const interval = setInterval(() => {
      setDeleteProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        } else {
          clearInterval(interval);
          setDeleteProgress(0);
          setDeleting(false);
          setShowDeleteButton(false);
          setUploadComplete(false);
          setUploadProgress(0);
          setProcessComplete(false) // Reset upload progress after successful delete
          return 100;
        }
      });
    }, 500);
  };

  //function handle processes
  const handleProcess = () => {


    setAnalyzing(true);
    const interval = setInterval(() => {
      setDeleteProgress((prevProgress) => {
        if (prevProgress < 90) {
          return prevProgress + 10;
        } else if (prevProgress > 80 && prevProgress < 95) {
          return 90;

        }
        else {
          clearInterval(interval);
          setProcessComplete(false)
          return 100;
        }
      });
    }, 2000);

    axios.post(

      "http://34.83.59.182:9999/processVideo",
      {

        originalVideoUrl: originalVideoUrl
      },
      {
        'content-type': 'application/json'
      }).then(function (response) {
        console.log(response.data.videoUrl)
        setProcessComplete(true);
        setProcessedVideoUrl(response.data.processedVideoUrl);
        setShowAnalyzeButton(false);
        setAnalyzing(false);
      }).catch(function (error) {


        console.log(error)
      });

  }

  return (

    <div className="container mt-5">
      <div className="col-md-12 text-center my-3">
        <h2>Upload the Video that needs to be Analysed</h2>
        <div className="mb-3">
          <label className="form-label">Choose Video file:</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".mp4"
            className="form-control my-3"
            style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)" }}
          />
          <button
            className="btn btn-primary my-5"
            disabled={uploading || uploadComplete}
            onClick={handleUpload}
          >
            {uploading ? "Uploading..." : uploadComplete ? "Upload Complete" : "Upload Video"}
          </button>
        </div>
      </div>

      {/* Delete Button */}
      {showDeleteButton && (
        <div className="col-md-12 text-center my-3">
          <button
            className="btn btn-danger ms-2"
            disabled={uploading}
            onClick={handleDelete}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {/* Upload Button Progress */}
      {showOriginalVideoPlayer && (

        <div className="container mt-5">
          <div className="col-md-12 text-center my-3">
            <h2>Original Video:</h2>
            <div className="col-md-12 text-center my-3 mx-auto d-flex align-items-center justify-content-center">
              <div className='player-wrapper'>
                <ReactPlayer
                  key={file.name}
                  className='react-player'
                  url={originalVideoUrl}
                  controls='true'
                  width='700px'
                  height='400px'
                />
              </div>

            </div>
          </div>
        </div>

      )}

      {/* Analyze Button */}

      {showAnalyzeButton && (
        <div className="col-md-12 text-center my-3">
          <button
            className="btn btn-primary ms-2"
            disabled={analyzing}
            onClick={handleProcess}
          >
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      )}

      {/* Analyze Button Progress */}
      {processComplete && (

        <div className="container mt-5">
          <div className="col-md-12 text-center my-3">
            <h2>Analyzed Video:</h2>
            <div className="col-md-12 text-center my-3 mx-auto d-flex align-items-center justify-content-center">
              <div className='player-wrapper'>
                <ReactPlayer
                  key={file.name}
                  className='react-player'
                  url={processedVideoUrl}
                  autoPlay={true}
                  loop={true}
                  controls='true'
                  width='700px'
                  height='400px'
                />
              </div>

            </div>
          </div>
        </div>

      )}

      {uploading || showUploadProgressBar || deleting || analyzing ? (
        <div className="mt-3 my-5 mx-5">
          <div className="progress">
            <div
              className={`progress-bar ${uploadComplete ? "bg-success" : deleting ? "bg-danger" : "bg-info"
                }`}
              role="progressbar"
              style={{ width: `${uploadComplete ? deleteProgress : uploadProgress}%` }}
              aria-valuenow={uploadComplete ? deleteProgress : uploadProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {uploadComplete ? deleteProgress : uploading ? uploadProgress : deleteProgress}%
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default FileUpload;
