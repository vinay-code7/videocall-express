const socket = io("/");

const peer = new Peer();
const peers = {};

const videoGrid = document.getElementById("video-grid");
const mainDiv = document.createElement("div");
const mainVideo = document.createElement("video");
const mainName = document.createElement("p");

mainDiv.setAttribute("id", "video-container");
mainName.setAttribute("id", "name-display");
mainName.innerHTML = NAME;
mainVideo.muted = true;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(mainVideo, stream);
    mainDiv.append(mainVideo);
    mainDiv.append(mainName);
    videoGrid.append(mainDiv);

    peer.on("call", (call) => {
      call.answer(stream);

      
    })
  });

// const myPeer = new Peer();

// const peers = {};

// navigator.mediaDevices
//   .getUserMedia({
//     video: true,
//     audio: true,
//   })
//   .then((stream) => {
//     addVideoStream(videoDiv, myVideo, myName, stream);

// myPeer.on("call", (call) => {
//   call.answer(stream);

//   const div = document.createElement("div");
//   const video = document.createElement("video");
//   const name = document.createElement("p");
//   div.setAttribute("id", "video-container");
//   name.setAttribute("id", "name-display");
//   name.innerHTML = NAME;

//   call.on("stream", (userVideoStream) => {
//     addVideoStream(div, video, name, userVideoStream);
//   });
// });

//   socket.on("user-connected", (userId, name) => {
//     console.log("connected", name);
//     connectToNewUser(userId, name, stream);
//   });
// });

// socket.on("user-disconnected", (userId, name) => {
//   console.log("disconnected", name);
//   if (peers[userId]) {
//     peers[userId].close();
//   }
// });

// myPeer.on("open", (userId) => {
//   console.log(userId);
//   socket.emit("join-room", ROOM_ID, NAME, userId);
// });

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
};

// const connectToNewUser = (userId, userName, stream) => {
//   const call = myPeer.call(userId, stream);
//   const div = document.createElement("div");
//   const video = document.createElement("video");
//   const name = document.createElement("p");
//   div.setAttribute("id", "video-container");
//   name.setAttribute("id", "name-display");
//   name.innerHTML = userName;

//   call.on("stream", (userVideoStream) => {
//     addVideoStream(div, video, name, userVideoStream);
//   });

//   call.on("close", () => {
//     div.remove();
//   });

//   peers[userId] = call;
// };
