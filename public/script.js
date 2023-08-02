const socket = io("/");

const myPeer = new Peer();

const videoGrid = document.getElementById("video-grid");

const videoDiv = document.createElement("div");
const myVideo = document.createElement("video");
const myName = document.createElement("p");

myName.classList.add("text-light");
myName.innerHTML = NAME

myVideo.muted = true;

const peers = {};

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      console.log("connected", userId);
      connectToNewUser(userId, stream);
    });
  });

socket.on("user-disconnected", (userId) => {
  console.log("disconnected", userId);
  if (peers[userId]) {
    peers[userId].close();
  }
});

myPeer.on("open", (userId) => {
  console.log(userId);
  socket.emit("join-room", ROOM_ID, userId);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoDiv.append(video);
  videoDiv.append(myName);
  videoGrid.append(videoDiv);
};

const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });

  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
};
