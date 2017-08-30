var RecordingHandler = {
  constructor: function() {
    this.mediaSource = new MediaSource();
    this.recordedBlobs;

    this.recordingVideo = document.getElementById("recording_screen");
    this.recordedVideo = document.getElementById("output_video");

    this.recordBtn = document.getElementById("record_btn");
    this.playBtn = document.getElementById("play_recorded");
    this.pauseBtn = document.getElementById("pause_recorded");
    this.downloadBtn = document.getElementById("download");

    this.recordBtn.onclick = this.ToggleRecording;
    this.playBtn.onclick = this.StartRecording;
    this.pauseBtn.onclick = this.PauseRecording;
    this.downloadBtn.onclick = this.DownloadRecording;

    this.constraints = {audio: true, video: true};    

    this.mediaSource.addEventListener('sourceopen', this.HandleSourceOpen, false);

    this.recordedVideo.addEventListener('error', function(ev) {
      console.error('MediaRecording.recordedMedia.error()');
      alert('Your browser can not play\n\n' + recordedVideo.src
      + '\n\n media clip. event: ' + JSON.stringify(ev));
    }, true);

    navigator.mediaDevices.getUserMedia(this.constraints).
      then(this.handleSuccess).catch(function (e) {
        console.log("navigator.getUserMedia error: ", e);
      });
  },
  HandleSourceOpen: function(e) {
    console.log("Successfully Opened Media Stream....");
    this.sourceBuffer = mediaSource.addSourceBuffer("video/webm; codecs='vp8'");
    console.log("Source buffer successfully created, ", this.sourceBuffer);
  },
  ToggleRecording: function() {
    if (this.recordBtn.innerHTML === "Start Recording") {
      this.recordBtn.textContext = "Stop Recording";
      this.playBtn.disabled = true;
      this.downloadBtn.disabled = true;
      this.recordedVideo.controls = false;
      this.StartRecording();
      return;
    }
    this.recordBtn.textContext = "Start Recording";
    this.playBtn.disabled = false;
    this.downloadBtn.disable = false;
    this.recordedVideo.controls = true;
    this.StopRecording();
  },
  StartRecording: function() {
    recordedBlobs = [];
    var options = {mimeType: 'video/webm;codecs=vp9'};
    if (MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + " is supported");
      return;
    }
    options = {mimeType: 'video/webm;codecs=vp8'};
    if (MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + " is supported");
      return;
    }
    options = {mimeType: 'video/webm'};
    if (MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + " is supported");
      return;
    }
    options = {};

    console.log("No mimeTypes supported");

    try {
      this.mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder: ' + e);
      return;
    }
    console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);

    this.mediaRecorder.onstop = function(e) {
      console.log("Recording stopped with event: ", e);
    };
    this.mediaRecorder.ondataavailable = function(e) {
      if (e.data && e.data.size > 0) {
        this.recordedBlobs.push(e.data);
      }
    };
    this.mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', this.MediaRecorder);
  },
  StopRecording: function() {
    this.mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
  },
  Play: function() {
    var superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
  },
  HandleSuccess: function(stream) {
    console.log('getUserMedia() got stream: ', stream);
    window.stream = stream;
    if (window.URL) {
      this.recordingVideo.src = window.URL.createObjectURL(stream);
    } else {
      this.recordingVideo.src = stream;
    }
  },
  Download: function() {
    var blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}
RecordingHandler.constructor();
