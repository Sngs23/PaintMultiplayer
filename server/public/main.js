const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const socket = new WebSocket(
    `ws${location.protocol.includes('https') ? 's' : ''}://${location.host}`
);

const colours = ["#2ecc71", "#3498db", "#e74c3c", "#9b59b6", "#f39c12", "#ecf0f1"];
const thisColour = colours[Math.floor(Math.random() * colours.length)];
ctx.fillStyle = thisColour;

let isMouseDown = false;
canvas.addEventListener("mouseup", () => { isMouseDown = false });

const sendPix = (x, y, w = 15, h = 15) => {
    ctx.fillRect(x, y, w, h);
    socket.send(
        JSON.stringify({
            x,
            y,
            colour: thisColour,
        })
    );
};

canvas.addEventListener("mousedown", e => {
    isMouseDown = true;
    sendPix(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", e => {
    if (isMouseDown) {
        sendPix(e.offsetX, e.offsetY);
    }
});

socket.onopen = () => {
    socket.onmessage = message => {
        const { x, y, colour } = JSON.parse(message.data);
        ctx.fillStyle = colour;
        ctx.fillRect(x, y, 15, 15);
        ctx.fillStyle = thisColour;
    };
};
