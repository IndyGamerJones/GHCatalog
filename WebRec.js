var stream;
var video = document.getElementById('MediaStreamVideo');

navigator.webkitGetUserMedia(
	{video: true, audio: true}, // Options
	function(localMediaStream) { // Success
		stream = localMediaStream;
		video.src = window.webkitURL.createObjectURL(stream);
	},
	function(err) { // Failure
		alert('getUserMedia failed: Code ' + err.code);
	}
);
document.onkeypress = function (e) {
    e = e || window.event;
    switch(e.keycode) {
      case 68:
        video.pause();
	break;
      case 65:
	video.play();
        break;
    }
};
