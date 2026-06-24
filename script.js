let historyLog = [];

function toSeconds(d, m, s) {
  return d * 3600 + m * 60 + s;
}

function fromSeconds(totalSec) {
  let d = Math.floor(totalSec / 3600);
  let m = Math.floor((totalSec % 3600) / 60);
  let s = totalSec % 60;
  return { d, m, s };
}

function getInput(num) {
  let d = parseInt(document.getElementById("degHour" + num).value) || 0;
  let m = parseInt(document.getElementById("minutes" + num).value) || 0;
  let s = parseInt(document.getElementById("seconds" + num).value) || 0;
  return { d, m, s };
}

function logHistory(entry) {
  historyLog.push(entry);
  let li = document.createElement("li");
  li.textContent = entry;
  document.getElementById("history").appendChild(li);
}

function clearHistory() {
  historyLog = [];
  document.getElementById("history").innerHTML = "";
}

function calculate(op) {
  let { d: d1, m: m1, s: s1 } = getInput(1);
  let { d: d2, m: m2, s: s2 } = getInput(2);
  let totalSec1 = toSeconds(d1, m1, s1);
  let totalSec2 = toSeconds(d2, m2, s2);

  let resultSec;
  switch(op) {
    case 'add': resultSec = totalSec1 + totalSec2; break;
    case 'subtract': resultSec = totalSec1 - totalSec2; break;
    case 'multiply': resultSec = totalSec1 * totalSec2; break;
    case 'divide': resultSec = totalSec1 / totalSec2; break;
  }

  let { d, m, s } = fromSeconds(Math.round(resultSec));
  let result = `Result: ${d}° ${m}' ${s}"`;
  document.getElementById("result").innerText = result;
  logHistory(result);
  drawVisualizer(d, m, s);
}

function getSelectedValue() {
  return parseInt(document.getElementById("valueSelector").value);
}

function convertToDecimal() {
  let num = getSelectedValue();
  let { d, m, s } = getInput(num);
  let decimal = d + m/60 + s/3600;
  let result = `Value ${num} → Decimal: ${decimal.toFixed(6)}`;
  document.getElementById("result").innerText = result;
  logHistory(result);
}

function convertToDMS() {
  let decimal = parseFloat(prompt("Enter decimal value:"));
  if (isNaN(decimal)) return;
  let d = Math.floor(decimal);
  let m = Math.floor((decimal - d) * 60);
  let s = Math.round(((decimal - d) * 60 - m) * 60);
  let result = `Decimal ${decimal} → DMS: ${d}° ${m}' ${s}"`;
  document.getElementById("result").innerText = result;
  logHistory(result);
  drawVisualizer(d, m, s);
}

function convertAngleToTime() {
  let num = getSelectedValue();
  let { d, m, s } = getInput(num);
  let decimalDeg = d + m/60 + s/3600;
  let hours = decimalDeg / 15;
  let result = `Value ${num}: ${decimalDeg.toFixed(2)}° = ${hours.toFixed(2)} hours`;
  document.getElementById("result").innerText = result;
  logHistory(result);
}

function convertTimeToAngle() {
  let num = getSelectedValue();
  let { d, m, s } = getInput(num);
  let decimalHours = d + m/60 + s/3600;
  let angle = decimalHours * 15;
  let result = `Value ${num}: ${decimalHours.toFixed(2)}h = ${angle.toFixed(2)}°`;
  document.getElementById("result").innerText = result;
  logHistory(result);
  drawVisualizer(angle, 0, 0);
}

function copyResult() {
  let text = document.getElementById("result").innerText;
  if (text) {
    navigator.clipboard.writeText(text);
    alert("Result copied to clipboard!");
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function drawVisualizer(d, m, s) {
  let canvas = document.getElementById("visualizer");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let angle = (d + m/60 + s/3600) * Math.PI / 180;

  ctx.beginPath();
  ctx.arc(100, 100, 80, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(100 + 80 * Math.cos(angle), 100 - 80 * Math.sin(angle));
  ctx.strokeStyle = "red";
  ctx.stroke();
}

function scaleValue(op) {
  let num = getSelectedValue();
  let { d, m, s } = getInput(num);
  let totalSec = toSeconds(d, m, s);

  let factor = parseFloat(document.getElementById("decimalFactor").value);
  if (isNaN(factor) || factor === 0) {
    alert("Please enter a valid decimal number.");
    return;
  }

  let resultSec;
  if (op === 'multiply') {
    resultSec = totalSec * factor;
  } else if (op === 'divide') {
    resultSec = totalSec / factor;
  }

  let { d: rd, m: rm, s: rs } = fromSeconds(Math.round(resultSec));
  let result = `Value ${num} ${op} by ${factor} → ${rd}° ${rm}' ${rs}"`;
  document.getElementById("result").innerText = result;
  logHistory(result);
  drawVisualizer(rd, rm, rs);
}
