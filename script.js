// --- model for one shot ---
function calculateXGForShot(distance, angle, shotType, situation, pressure) {
  distance = Number(distance);
  angle = Number(angle);
  if (!isFinite(distance) || !isFinite(angle)) return 0;

  let xg = 0;

  // Distance decay
  xg += Math.exp(-distance / 30);

  // Angle
  if (angle <= 30) xg += 0.3;
  else if (angle <= 60) xg += 0.2;
  else if (angle <= 90) xg += 0.1;
  else xg += 0.05;

  // Shot type
  xg += (shotType === "foot") ? 0.1 : -0.1;

  // Situation
  if (situation === "openPlay") xg += 0.1;
  else if (situation === "setPiece") xg += 0.05;
  else if (situation === "counterAttack") xg += 0.15;

  // Pressure
  if (pressure === "low") xg += 0.1;
  else if (pressure === "medium") xg += 0.05;
  else if (pressure === "high") xg -= 0.1;

  return Math.max(0, Math.min(1, xg));
}

// --- single shot calculator ---
document.getElementById("calcXG").addEventListener("click", () => {
  const distance = document.getElementById("distance").value;
  const angle = document.getElementById("angle").value;
  const shotType = document.getElementById("shotType").value;
  const situation = document.getElementById("situation").value;
  const pressure = document.getElementById("pressure").value;

  const xg = calculateXGForShot(distance, angle, shotType, situation, pressure);
  document.getElementById("xg-result").textContent = xg.toFixed(2);
});

// --- multi-shot block creator ---
function createShotInputBlock() {
  const div = document.createElement("div");
  div.className = "shot-input";
  div.innerHTML = `
    <label>Distance (m):</label>
    <input type="number" class="distance" step="0.1">

    <label>Angle (°):</label>
    <input type="number" class="angle" step="1" max="180">

    <label>Type:</label>
    <select class="shotType">
      <option value="foot">Foot</option>
      <option value="head">Header</option>
    </select>

    <label>Situation:</label>
    <select class="situation">
      <option value="openPlay">Open Play</option>
      <option value="setPiece">Set Piece</option>
      <option value="counterAttack">Counter Attack</option>
    </select>

    <label>Pressure:</label>
    <select class="pressure">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  `;
  return div;
}

// --- add new shot input ---
document.getElementById("addShot").addEventListener("click", () => {
  document.getElementById("shotInputs").appendChild(createShotInputBlock());
});

// --- calculate total xG ---
document.getElementById("calcTotalXG").addEventListener("click", () => {
  const shots = document.querySelectorAll("#shotInputs .shot-input");
  let total = 0;

  shots.forEach(shot => {
    const d = shot.querySelector(".distance").value;
    const a = shot.querySelector(".angle").value;
    const st = shot.querySelector(".shotType").value;
    const si = shot.querySelector(".situation").value;
    const pr = shot.querySelector(".pressure").value;

    if (d && a) total += calculateXGForShot(d, a, st, si, pr);
  });

  document.getElementById("total-xg-result").textContent = total.toFixed(2);
});
