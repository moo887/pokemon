const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const encounterMessage = document.getElementById('encounterMessage');
const catchButton = document.getElementById('catchButton');
const inventoryDisplay = document.getElementById('inventory');

// Player properties
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 5,
  color: 'blue'
};

// Possible encounters (now with emojis)
const encounters = [
  { name: 'Cat', emoji: '🐱' },
  { name: 'Dog', emoji: '🐶' },
  { name: 'Tree', emoji: '🌲' },
  { name: 'Rock', emoji: '🪨' },
  { name: 'Mysterious Object', emoji: '❓' }
];

// Game state
let isEncounter = false;
let currentEncounter = null;
let collectedItems = {}; // Tracks how many of each item the player has
let objectsOnMap = [];  // Stores encountered objects (emoji + position)

// Initialize inventory (start with 0 of everything)
encounters.forEach(item => {
  collectedItems[item.name] = 0;
});

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Draw objects on the map (emojis)
function drawObjects() {
  objectsOnMap.forEach(obj => {
    ctx.font = '24px Arial';
    ctx.fillText(obj.emoji, obj.x, obj.y);
  });
}

// Update inventory display
function updateInventory() {
  let inventoryText = 'Inventory: ';
  for (const item in collectedItems) {
    const emoji = encounters.find(e => e.name === item).emoji;
    inventoryText += `${emoji}×${collectedItems[item]} `;
  }
  inventoryDisplay.textContent = inventoryText;
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Handle player movement
function movePlayer(e) {
  if (isEncounter) return; // Stop movement during encounters

  switch (e.key) {
    case 'ArrowUp': player.y -= player.speed; break;
    case 'ArrowDown': player.y += player.speed; break;
    case 'ArrowLeft': player.x -= player.speed; break;
    case 'ArrowRight': player.x += player.speed; break;
  }

  // Keep player within canvas bounds
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // Random encounter check (5% chance per move)
  if (Math.random() < 0.05) {
    startEncounter();
  }
}

// Start a random encounter
function startEncounter() {
  isEncounter = true;
  currentEncounter = encounters[Math.floor(Math.random() * encounters.length)];
  encounterMessage.textContent = `You encountered a wild ${currentEncounter.name}!`;
  encounterMessage.classList.remove('hidden');
  catchButton.classList.remove('hidden');
}

// Catch the encountered thing
catchButton.addEventListener('click', () => {
  // Add the item to the map (at player's position)
  objectsOnMap.push({
    emoji: currentEncounter.emoji,
    x: player.x,
    y: player.y
  });

  // Update inventory
  collectedItems[currentEncounter.name]++;
  updateInventory();

  // Check if the player has collected enough of this item
  if (collectedItems[currentEncounter.name] === 3) {
    alert(`🎉 Congrats! You collected 3 ${currentEncounter.name}s!`);
  }

  endEncounter();
});

// End the encounter
function endEncounter() {
  isEncounter = false;
  encounterMessage.classList.add('hidden');
  catchButton.classList.add('hidden');
}

// Game loop
function gameLoop() {
  clearCanvas();
  drawObjects(); // Draw objects first (under player)
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

// Initialize inventory display
updateInventory();

// Event listeners
window.addEventListener('keydown', movePlayer);

// Start the game
gameLoop();