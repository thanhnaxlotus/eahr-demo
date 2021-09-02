<template>
  <div class="hello">
    <br>
    <button id="btn-start-recording" :disabled="disabled" @click="startRec">Start Recording</button>&nbsp;&nbsp;
    <button
      id="btn-stop-recording"
      :disabled="!disabled"
      @click="stopRec"
    >Stop Recording</button>
    <!-- <button id="btn-download" :disabled="disabled" @click="download">Download</button> -->
    <hr>
    <video controls autoplay playsinline ref="video" height="500" width="700"></video>
  </div>
</template>

<script>
import RecordRTC from "recordrtc";

export default {
  name: "VideoRecord",
  data() {
    return {
      recorder: null,
      disabled: false,
      fileId: null
    };
  },
  mounted() {},
  methods: {
    startRec() {
      this.$axios.get('/api/init-file')
      .then(response => {
      this.disabled = true;
        console.log('response', response)
        this.fileId = response.data.time;
        this.capture(stream => {
          const video = this.$refs["video"];
          video.muted = true;
          video.volume = 0;
          video.srcObject = stream;
          this.recorder = RecordRTC(stream, {
            type: 'video',
            timeSlice: 5000,
            ondataavailable: this.createStream
          });
          this.recorder.startRecording();
          this.recorder.stream = stream;
          // this.recorder.ondataavailable = function(blob) {
          //   console.log('data', blod);
          // },
          this.disabled = true;
        });
      }).catch(error => {
        console.log('error', error)
      })
    },
    async createStream(blob) {
      console.log('data', blob, this.fileId, blob.size);
      var url = URL.createObjectURL(blob);
      console.log("URL: " + url)
      const buf = await blob.arrayBuffer();
      console.log( buf.byteLength );
      let config = {
        header : {
          'Content-Type' : 'multipart/form-data',
          // "responseType": "stream",
        }
      }
      let file =  new File([blob], `interview-${(new Date).getTime()}`, { type: 'video/webm' });
      let data = new FormData()
      data.append('f', file)
      data.append('name', this.fileId)
      this.$axios.post('/api/create-stream', data,  config)
      .then(response => {
        console.log('response', response)
      }).catch(error => {
        console.log('error', error)
      });
    },
    stopRec() {
      this.disabled = false;
      this.recorder.stopRecording(this.stopRecordingCallback);
    },
    capture(callback) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(function(stream) {
          callback(stream);
        })
        .catch(function(error) {
          alert("Unable to capture your camera. Please check console logs.");
          console.error(error);
        });
    },
    stopRecordingCallback() {
      const video = this.$refs["video"];
      video.src = video.srcObject = null;
      video.muted = false;
      video.volume = 1;
      video.src = URL.createObjectURL(this.recorder.getBlob());

      this.upload();

      if(video.src){
        this.recorder.stream.stop();
        this.recorder.destroy();
        this.recorder = null;
        // video.src = video.srcObject = null;
      }
    },
    upload(){
      this.$axios.post('/api/upload-complete',{withCredentials: false}, {
        name: this.fileId,
      })
      .then(response => {
        console.log('response', response)
      }).catch(error => {
        console.log('error', error)
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
