const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
// const { async } = require('regenerator-runtime');
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';  위 코드와 동일한 방법이다.

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {

    const ffmpeg = createFFmpeg({ log:true });
    // ffmpeg 파일 불러오기!
    await ffmpeg.load();

    // ffmpeg 안에 가상의 파일을 만들어주는 작업
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

    // recording.webm 은 위 코드에서 만든 파일이다. "-r", "60" 초당 프레임 갯수를 의미한다.
    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

    // "-ss" 명령어는 해당 파일의 특정 시간으로 갈 수 있게 해준다. 이동한 시간의 스크린샷 한장을 찍는다.
    await ffmpeg.run("-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg");

    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    // mp4File 는 비디오파일로 바이너리 값이다, raw data, 뭐든 할 수 있음
    // mp4File.buffer 는 비디오파일을 나타내는 바이트 배열 raw data에 접근하기 위한 것
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");
    // readFile 의 리턴 값은 Unit8Array(자연수 리스트) 

    // 자바스크립트의 파일과 같은 객체를 만드는 중 : Blob 에 바이너리 데이터를 줘야 한다.
    const thumbBlob = new Blob([thumbFile.buffer], {type:"image/jpg"});
    const thumbUrl = URL.createObjectURL(thumbBlob); 

    // url 은 서버에 있는게 아니라 브라우저를 닫기 전까지만 브라우저에 있다.
    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    const mp4Url = URL.createObjectURL(mp4Blob);

    // <a>태그 안에는 download 라는 속성이 존재, href 에 지정된 파일을 다운로드 해주는 기능.
    // download 속성에는 filename 옵션이 존재하는데 a.download = "myRecording.webm"; 와 같이 작성함으로서 실제 파일과 다른 이름으로 다운 가능
    const a = document.createElement("a");
    a.href =  mp4Url;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href = thumbUrl;
    thumbA.download = "MyThumbnail.jpg";
    document.body.appendChild(thumbA);
    thumbA.click();

    // 브라우저의 속도를 고려하여 파일연결을 해제해줄 수도 있다. 해제시 바로 사라진다.
    ffmpeg.FS("unlink", "recording.webm");
    ffmpeg.FS("unlink", "output.mp4");
    ffmpeg.FS("unlink", "thumbnail.jpg");
    
    // 링크연결 또한 해제해준다.
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
}


const handleStop = () => {
    startBtn.innerText = "Download Recording"
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
}

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
    // ondataavailable 은 녹화가 끝나고 발생하는 이벤트.
    recorder.ondataavailable = (e) => {
        // 메모리 상에 있는 파일에 접근할 수 있도록 브라우저가 생성한 URL
        // e.data 는 binary data로 브라우저에서 읽을 수 있는 데이터로 브라우저에 입력시 다운로드 처리가 된다. 
        // videoFile 은 Blob 객체로 타입은 비디오 이다.
        videoFile = URL.createObjectURL(e.data);
        video.srcObject = null;
        video.src = videoFile; // video.src 는 지정해주기 전까지는 값이 없음. 비디오 파일의 위치를 명시.
        video.loop = true;
        video.play();
    };
    recorder.start();


}

const init = async (e) => {
    // 사용자에게 미디어 입력 장치 사용 권한을 요청하며, 사용자가 수락하면 요청한 미디어 종류의 트랙을 포함한 MediaStream 을 반환합니다.
    // 요청할 미디어 유형과 각각에 대한 요구사항을 지정하는 객체를 받는다.
    stream = await navigator.mediaDevices.getUserMedia({
        audio:true, 
        video: true,
    });
    video.srcObject = stream;
    video.play();
}
init();



startBtn.addEventListener("click", handleStart);