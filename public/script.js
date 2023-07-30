const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
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

const myPeer = new Peer();

myPeer.on("open", (userId) => {
  console.log(userId);
  socket.emit("join-room", ROOM_ID, userId);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
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
