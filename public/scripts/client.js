const socket = io();

let username = "User_" + Math.random().toString(36).substring(7);
let roomId = document.querySelector("#roomId").value;
let userNameChange = document.querySelector("#userName");
userNameChange.innerHTML = username;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector("#message__area");

// do {
//   username = prompt("Enter your name: ");
// } while (!username);

let editor = CodeMirror.fromTextArea(document.getElementById("code-screen"), {
  lineNumbers: true,
  theme: "monokai",
});
var code = $("#code-screen").val();
const EditorClient = ot.EditorClient;
const SocketIOAdapter = ot.SocketIOAdapter;
const CodeMirrorAdapter = ot.CodeMirrorAdapter;

let cmClient;

function init(str, revision, clients, serverAdapter) {
  if (!code) {
    editor.setValue(str);
  }

  cmClient = window.cmClient = new EditorClient(
    revision,
    clients,
    serverAdapter,
    new CodeMirrorAdapter(editor)
  );
}

socket.on("doc", (obj) => {
  init(obj.str, obj.revision, obj.clients, new SocketIOAdapter(socket));
});

socket.emit("joinRoom", { room: roomId, username: username });

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(textarea.value);
    textarea.value = "";
  }
});

const sendMessage = (message) => {
  let msg = {
    user: username,
    message: message,
  };
  //Append
  //   console.log(msg);
  appendMessage(msg, "outgoing");
  scrollToBottom();
  //Send to server
  socket.emit("message", msg);
};

const appendMessage = (msg, type) => {
  //   console.log(msg);
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");
  let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
};

//receive message

socket.on("message", (msg) => {
  if (msg.user === username) return;
  appendMessage(msg, "incoming");
  scrollToBottom();
});

const scrollToBottom = () => {
  messageArea.scrollTop = messageArea.scrollHeight;
};

//code editor

//
// PeerJS
// Compatibility shim
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
// PeerJS object
var peer = new Peer(username + roomId);

peer.on("open", function () {
  $("#my-id").text(peer.id);
});

// Receiving a call
peer.on("call", function (call) {
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer(window.localStream);
  step3(call);
});

peer.on("error", function (err) {
  alert(err.message);
  // Return to step 2 if error occurs
  step2();
});

// Click handlers setup
$(function () {
  $("#make-call").click(function () {
    // Initiate a call!
    var call = peer.call($("#callto-id").val(), window.localStream);
    step3(call);
  });
  $("#end-call").click(function () {
    window.existingCall.close();
    step2();
  });
  step1();
});

function step1() {
  // Get audio/video stream
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then(function (stream) {
      // Set your video displays
      $("#my-video").prop("srcObject", stream);
      window.localStream = stream;
      step2();
    })
    .catch(function (error) {
      $("#step1-error").show();
    });
}

function step2() {
  $("#step1, #step3").hide();
  $("#step2").show();
}

function step3(call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Promise to wait for the stream on the call
  const waitForStream = new Promise((resolve) => {
    call.on("stream", function (stream) {
      $("#second-video").prop("srcObject", stream);
      resolve();
    });
  });

  // Update existingCall and display peer ID after stream is received
  waitForStream.then(() => {
    window.existingCall = call;
    $("#second-id").text(call.peer);
  });

  // Set up event listener for call close event
  call.on("close", step2);

  // UI stuff: Hide/show relevant elements
  $("#step1, #step2").hide();
  $("#step3").show();
}
