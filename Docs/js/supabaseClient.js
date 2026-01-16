let xp = localStorage.getItem("xp") || 0;
let list = JSON.parse(localStorage.getItem("missions")) || [];

function updateUI() {
  if (document.getElementById("xp")) {
    document.getElementById("xp").textContent = xp;
    document.getElementById("rank").textContent = getRank();
  }
}

function addXP() {
  xp = parseInt(xp) + 50;
  localStorage.setItem("xp", xp);
  updateUI();
}

function getRank() {
  if (xp < 100) return "Recruit";
  if (xp < 300) return "Soldier";
  if (xp < 700) return "Commander";
  return "Legend";
}

function addMission() {
  const input = document.getElementById("missionInput");
  if (input.value === "") return;

  list.push(input.value);
  localStorage.setItem("missions", JSON.stringify(list));
  input.value = "";
  showMissions();
}

function showMissions() {
  const ul = document.getElementById("missionList");
  if (!ul) return;

  ul.innerHTML = "";
  list.forEach((mission, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${mission} <button onclick="removeMission(${index})">✘</button>`;
    ul.appendChild(li);
  });
}

function removeMission(index) {
  list.splice(index, 1);
  localStorage.setItem("missions", JSON.stringify(list));
  showMissions();
}

showMissions();
updateUI();
