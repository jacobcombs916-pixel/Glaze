📘 Gluo1.04 Official ManualSection 1: Local Property SystemLocal commands set the "rules" for the engine. They should usually be placed at the top of your script or at the start of a Level block.CommandDescriptionLocal:player.color = "Color"Changes the player's color (Hex or Name).Local:player.shape = "Shape"Sets player shape to Cir, Sq, or Tri.Local:wall.[Shape] = "Color"Sets global color for all walls of that shape.Local:hazard.[Shape] = "Color"Sets global color for all hazards of that shape.Section 2: The Build CommandThe .build_ command defines what a shape does in the game world.Syntax: DrawShape:[Shape].build_=[Type](x, y, size)Wall: Acts as a solid physical barrier.Hazard: Touching this resets the player to the start of the level.Win: Touching this triggers the next Level:[n] block.Example: DrawShape:cir.build_=Hazard(400, 200, 50)Section 3: Level ManagementTo create multiple stages, use the Level: header. The engine will only execute code found under the current level number.Code snippetLevel:1
SetBackground("blue")
DrawShape:sq.build_=Win(700, 350, 40)

Level:2
SetBackground("red")
DrawShape:tri.build_=Hazard(400, 200, 80)
Section 4: Global CommandsSetBackground("color"): Changes the canvas background color.Print out("message"): Sends text/emojis to the console.MovePlayer(x, y): Sets the manual starting position (Default is 50, 50).🛠️ Full renderer.js Source (Current)JavaScriptconst { ipcRenderer } = require('electron');

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
    if (shape === 'cir' || shape === 'circle') {
        context.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    } else if (shape === 'tri' || shape === 'triangle') {
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

// ===== MOVEMENT & COLLISION =====
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
                runG1(editor.value); 
                player.x = 50; player.y = 50; 
                canMove = false;
            }
        }
    });

    if (canMove) { player.x = nx; player.y = ny; }
});

// ===== INTERPRETER =====
async function runG1(code) {
    objects = [];
    const lines = code.split(/\r?\n/);
    let targetLevelFound = false;

    for (let line of lines) {
        const t = line.trim();
        if (t === `Level:${currentLevel}`) { targetLevelFound = true; continue; }
        if (t.startsWith('Level:') && t !== `Level:${currentLevel}`) { targetLevelFound = false; }

        if (!targetLevelFound || !t || t.startsWith("//")) continue;

        if (t.startsWith('Local:player.color')) player.color = /"(.+)"/.exec(t)[1];
        if (t.startsWith('Local:player.shape')) {
            const s = /"(.+)"/.exec(t)[1].toLowerCase();
            player.shape = s.startsWith('cir') ? 'cir' : s.startsWith('tri') ? 'tri' : 'sq';
        }
        if (t.startsWith('Local:wall.')) {
            const shape = t.split('.')[1].split('=')[0].trim();
            wallProps[shape] = /"(.+)"/.exec(t)[1];
        }
        if (t.startsWith('DrawShape:')) {
            const shape = t.split(':')[1].split('.')[0].trim();
            const buildType = t.split('build_=')[1].split('(')[0].trim().toLowerCase();
            const params = /\(([^)]+)\)/.exec(t)[1].split(',');
            objects.push({ shape, build: buildType, x: parseInt(params[0]), y: parseInt(params[1]), size: parseInt(params[2]) });
        }
        if (t.startsWith('SetBackground')) backgroundColor = /"(.+)"/.exec(t)[1];
        if (t.startsWith('Print out')) {
            const p = document.createElement('p');
            p.textContent = /"(.+)"/.exec(t)[1];
            outputDiv.appendChild(p);
        }
    }
}
document.getElementById('runBtn').onclick = () => { currentLevel = 1; runG1(editor.value); }