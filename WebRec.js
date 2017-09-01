var RecordingHandler = {
  constructor: function() {
    this.mediaSource = new MediaSource();
    this.recordedBlobs;
    this.mediaRecorder;
    this.running = true;

    this.recordingVideo = document.getElementById("recording_screen");
    this.recordedVideo = document.getElementById("output_video");

    this.recordBtn = document.getElementById("record_btn");
    this.playBtn = document.getElementById("play_recorded");
    this.pauseBtn = document.getElementById("pause_recorded");
    this.downloadBtn = document.getElementById("download");

    var r = this;
    this.recordBtn.onclick = function() {r.ToggleRecording();};
    this.playBtn.onclick = function() {r.Play()};
    this.pauseBtn.onclick = function() {r.PauseRecording();};
    this.downloadBtn.onclick = function() {r.DownloadRecording();};

    this.constraints = {audio: true, video: true};    

    this.mediaSource.addEventListener('sourceopen', function(e) {this.HandleSourceOpen(e);}, false);

    this.recordedVideo.addEventListener('error', function(ev) {
      console.error('MediaRecording.recordedMedia.error()');
      alert('Your browser can not play\n\n' + recordedVideo.src
      + '\n\n media clip. event: ' + JSON.stringify(ev));
    }, true);
    navigator.mediaDevices.getUserMedia(this.constraints).
      then(function(str) {r.HandleSuccess(str);}).catch(function (e) {
        console.log("navigator.getUserMedia error: ", e);
      });
  },
  PauseRecording: function() {
    if (this.pauseBtn.textContent === "Pause") {
      this.pauseBtn.textContent = "Resume";
      this.mediaRecorder.pause();
      return;
    }
    this.pauseBtn.textContent = "Pause";
    this.mediaRecorder.play();
  },
  HandleSourceOpen: function(e) {
    console.log("Successfully Opened Media Stream....");
    this.sourceBuffer = mediaSource.addSourceBuffer("video/webm; codecs='vp8'");
    console.log("Source buffer successfully created, ", this.sourceBuffer);
  },
  ToggleRecording: function() {
    if (this.recordBtn.textContent === "Start Recording") {
      this.recordBtn.textContent = "Stop Recording";
      this.playBtn.disabled = true;
      this.downloadBtn.disabled = true;
      this.recordedVideo.controls = false;
      this.StartRecording();
      return;
    }
    this.recordBtn.textContent = "Start Recording";
    this.playBtn.disabled = false;
    this.downloadBtn.disable = false;
    this.recordedVideo.controls = true;
    this.StopRecording();
  },
  StartRecording: function() {
    this.recordedBlobs = [];
    options = {mimeType: 'video/webm;codecs=vp8'};
    if (MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + " is supported");
    }
    options = {mimeType: 'video/webm'};
    if (MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + " is supported"); // test
    }
    options = {};

    console.log("No mimeTypes supported");
    var options = {mimeType: 'video/webm;codecs=vp9'};
    if (MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + " is supported");
    }

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
    var r = this;
    this.mediaRecorder.ondataavailable = function(e) {
      if (e.data && e.data.size > 0) {
         r.recordedBlobs.push(e.data);
      }
    };
    this.mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', this.mediaRecorder);
  },
  StopRecording: function() {
    this.mediaRecorder.stop();
    console.log('Recorded Blobs: ', this.recordedBlobs);
  },
  Play: function() {
    var superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
    this.recordedVideo.src = window.URL.createObjectURL(superBuffer);
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
  DownloadRecording: function() {
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
