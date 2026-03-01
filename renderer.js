const { ipcRenderer } = require('electron');

const editor = document.getElementById('editor');
const outputDiv = document.getElementById('output');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let backgroundColor = 'black';
let objects = [];
let buttons = []; 
let currentLevel = 1;

// Local Property Stores
let player = { x: 50, y: 50, w: 30, h: 30, color: 'red', shape: 'sq' };
let wallProps = { sq: 'gray', cir: 'gray', tri: 'gray' };
let hazardProps = { sq: 'red', cir: 'red', tri: 'red' };
let winProps = { sq: 'green', cir: 'green', tri: 'green' };

// ===== GEOMETRY HELPER =====
function drawGeometry(shape, x, y, size, context) {
    context.beginPath();
    if (shape === 'cir') {
        context.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    } else if (shape === 'tri') {
        context.moveTo(x + size/2, y);
        context.lineTo(x, y + size);
        context.lineTo(x + size, y + size);
        context.closePath();
    } else {
        context.rect(x, y, size, size);
    }
    context.fill();
}

// ===== RENDER LOOP =====
function render() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    objects.forEach(obj => {
        if (obj.build === 'wall') ctx.fillStyle = wallProps[obj.shape] || "gray";
        else if (obj.build === 'hazard') ctx.fillStyle = hazardProps[obj.shape] || "red";
        else if (obj.build === 'win') ctx.fillStyle = winProps[obj.shape] || "green";
        else ctx.fillStyle = obj.color || "white";
        drawGeometry(obj.shape, obj.x, obj.y, obj.size, ctx);
    });

    ctx.fillStyle = player.color;
    drawGeometry(player.shape, player.x, player.y, player.w, ctx);
    requestAnimationFrame(render);
}
render();

// ===== MOVEMENT & LEVEL TRANSITION =====
document.addEventListener('keydown', (e) => {
    if (document.activeElement === editor) return;
    const s = 10;
    let nx = player.x;
    let ny = player.y;

    if (e.key === 'ArrowUp') ny -= s;
    if (e.key === 'ArrowDown') ny += s;
    if (e.key === 'ArrowLeft') nx -= s;
    if (e.key === 'ArrowRight') nx += s;

    let canMove = true;
    objects.forEach(o => {
        const isHit = nx < o.x + o.size && nx + player.w > o.x && 
                      ny < o.y + o.size && ny + player.h > o.y;
        
        if (isHit) {
            if (o.build === 'wall') canMove = false;
            if (o.build === 'hazard') { player.x = 50; player.y = 50; canMove = false; }
            if (o.build === 'win') {
                currentLevel++;
                alert(`Victory! Loading Level ${currentLevel}`);
                runG1(editor.value); // Re-run interpreter to find next level block
                player.x = 50; player.y = 50; // Reset player
                canMove = false;
            }
        }
    });

    if (canMove) { player.x = nx; player.y = ny; }
});

// ===== GLUO1.04 MULTI-LEVEL INTERPRETER =====
async function runG1(code) {
    objects = [];
    logToConsole(`⚡ Loading Data for Level ${currentLevel}...`);

    const lines = code.split(/\r?\n/);
    let targetLevelFound = false;

    for (let line of lines) {
        const t = line.trim();
        
        // Check for Level Header: Level:1, Level:2, etc.
        if (t === `Level:${currentLevel}`) {
            targetLevelFound = true;
            continue;
        }
        // If we hit the next level header, stop reading
        if (t.startsWith('Level:') && t !== `Level:${currentLevel}`) {
            targetLevelFound = false;
        }

        if (!targetLevelFound || !t || t.startsWith("//")) continue;

        // --- Standard Gluo1.04 Commands ---
        if (t.startsWith('Local:player.color')) player.color = /"(.+)"/.exec(t)[1];
        if (t.startsWith('Local:player.shape')) {
            const s = /"(.+)"/.exec(t)[1].toLowerCase();
            player.shape = s.startsWith('cir') ? 'cir' : s.startsWith('tri') ? 'tri' : 'sq';
        }
        if (t.startsWith('DrawShape:')) {
            const shape = t.split(':')[1].split('.')[0].trim();
            const buildType = t.split('build_=')[1].split('(')[0].trim().toLowerCase();
            const params = /\(([^)]+)\)/.exec(t)[1].split(',');
            objects.push({
                shape: shape, build: buildType,
                x: parseInt(params[0]), y: parseInt(params[1]), size: parseInt(params[2])
            });
        }
        if (t.startsWith('SetBackground')) backgroundColor = /"(.+)"/.exec(t)[1];
    }
}

function logToConsole(msg) {
    const p = document.createElement('p');
    p.textContent = msg;
    outputDiv.appendChild(p);
}

document.getElementById('runBtn').onclick = () => {
    currentLevel = 1; // Reset to 1 when hitting the UI Run button
    runG1(editor.value);
};