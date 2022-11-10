// mode
const penBtn = document.getElementById("pen-btn");
const shapeBtn = document.getElementById("shape-btn");
const rectangleBtn = document.getElementById("rectangle-btn");
const circleBtn = document.getElementById("circle-btn");

const eraserBtn = document.getElementById("eraser-btn");
const fillBtn = document.getElementById("fill-btn");
const fileInput = document.getElementById("file");
const resetBtn = document.getElementById("reset-btn");

// text
const textInput = document.getElementById("text");
const fontTypes = document.getElementById("fontTypes");
const fontSizes = document.getElementById("fontSizes");
const fontEffects = document.getElementById("fontEffects");

// save
const saveBtn = document.getElementById("save");

//color
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");

//brush
const lineWidth = document.getElementById("line-width");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

let isPainting = false;
let isFilling = false;
let mode = 0;

let startX, startY;

function onMove(event) {
  if (isPainting) {
    if (mode === 2) {
      ctx.fillRect(
        startX,
        startY,
        event.offsetX - startX,
        event.offsetY - startY
      );
      return;
    } else if (mode === 3) {
      ctx.arc(startX, startY, event.offsetX - startX, 0, 2 * Math.PI);
      ctx.fill();
      return;
    } else if (mode === 0 || mode === 2 || mode === 5) {
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      return;
    }
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
  startX = event.offsetX;
  startY = event.offsetY;
}

function cancelPainting() {
  if (mode !== 5) {
    isPainting = false;
    ctx.beginPath();
  } else {
    isPainting = false;
    ctx.fill();
    ctx.beginPath();
  }
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else if (mode === 4) {
    const text = textInput.value;
    const textFont = fontTypes.value;
    const textSize = fontSizes.value;
    const textEffect = fontEffects.value;
    if (text !== "" && textEffect === "fill") {
      ctx.beginPath();
      ctx.save();
      ctx.lineWidth = 1;
      ctx.font = `${textSize}px ${textFont}`;
      ctx.fillText(text, event.offsetX, event.offsetY);
      ctx.restore();
    } else if (textEffect === "stroke") {
      ctx.beginPath();
      ctx.save();
      ctx.lineWidth = 1;
      ctx.font = `${textSize}px ${textFont}`;
      ctx.strokeText(text, event.offsetX, event.offsetY);
      ctx.restore();
    }
  }
}

function onClickReset() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onClickErase() {
  ctx.strokeStyle = "white";
  isFilling = false;
  mode = 0;
  ctx.beginPath();
}

function onClickFile(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

function onClickSave() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

function onClickPen() {
  mode = 0;
}

function onClickFill() {
  mode = 1;
  isFilling = true;
}

function onClickRectangle() {
  mode = 2;
  canvas.style.cursor = "crosshair";
}

function onClickCircle() {
  mode = 3;
  canvas.style.cursor = "crosshair";
}

function onClickText() {
  mode = 4;
  canvas.style.cursor = "text";
}

function onClickShape() {
  mode = 5;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

penBtn.addEventListener("click", onClickPen);
shapeBtn.addEventListener("click", onClickShape);
rectangleBtn.addEventListener("click", onClickRectangle);
circleBtn.addEventListener("click", onClickCircle);

eraserBtn.addEventListener("click", onClickErase);
fillBtn.addEventListener("click", onClickFill);
fileInput.addEventListener("change", onClickFile);
resetBtn.addEventListener("click", onClickReset);

textInput.addEventListener("click", onClickText);

saveBtn.addEventListener("click", onClickSave);
