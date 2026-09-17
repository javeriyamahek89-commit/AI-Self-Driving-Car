/* =====================================================
   AI SMART CITY DRIVING SIMULATOR
   FINAL WORKING GAME.JS
===================================================== */
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const minimap = document.getElementById("minimap");
const mctx = minimap.getContext("2d");
/* -----------------------------------------------------
   CANVAS
----------------------------------------------------- */
canvas.width = 1100;
canvas.height = 500;
/* -----------------------------------------------------
   UI
----------------------------------------------------- */
const speedValue = document.getElementById("speedValue");
const modeValue = document.getElementById("modeValue");
const signalValue = document.getElementById("signalValue");
const aiStatus = document.getElementById("aiStatus");
const scoreValue = document.getElementById("scoreValue");

const destinationText =
    document.getElementById("destinationText");

const controlText =
    document.getElementById("controlText");

const aiDecision =
    document.getElementById("aiDecision");

const missionText =
    document.getElementById("missionText");

const levelText =
    document.getElementById("levelText");

const startBtn =
    document.getElementById("startBtn");

const aiBtn =
    document.getElementById("aiBtn");

const resetBtn =
    document.getElementById("resetBtn");

const speedLevel =
    document.getElementById("speedLevel");

const overlay =
    document.getElementById("gameOverlay");

const overlayTitle =
    document.getElementById("overlayTitle");

const overlayMessage =
    document.getElementById("overlayMessage");

const nextLevelBtn =
    document.getElementById("nextLevelBtn");


/* -----------------------------------------------------
   WORLD
----------------------------------------------------- */

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 2200;


/* -----------------------------------------------------
   ROADS
----------------------------------------------------- */

const roads = [

    /* horizontal roads */
    {
        x:0,
        y:700,
        w:WORLD_WIDTH,
        h:320
    },

    {
        x:0,
        y:1380,
        w:WORLD_WIDTH,
        h:320
    },

    /* vertical roads */
    {
        x:430,
        y:0,
        w:320,
        h:WORLD_HEIGHT
    },

    {
        x:1340,
        y:0,
        w:320,
        h:WORLD_HEIGHT
    },

    {
        x:2250,
        y:0,
        w:320,
        h:WORLD_HEIGHT
    }
];


/* -----------------------------------------------------
   BUILDINGS
----------------------------------------------------- */

const buildings = [

    {x:60,y:60,w:330,h:580},
    {x:800,y:60,w:450,h:580},
    {x:1710,y:60,w:430,h:580},
    {x:2620,y:60,w:300,h:580},

    {x:60,y:1060,w:330,h:280},
    {x:800,y:1060,w:450,h:280},
    {x:1710,y:1060,w:430,h:280},
    {x:2620,y:1060,w:300,h:280},

    {x:60,y:1740,w:330,h:380},
    {x:800,y:1740,w:450,h:380},
    {x:1710,y:1740,w:430,h:380},
    {x:2620,y:1740,w:300,h:380}
];


/* -----------------------------------------------------
   LEVELS
----------------------------------------------------- */

const levels = [

    {
        name:"CITY TRAINING",
        start:{x:590,y:1900},
        destination:{x:590,y:850}
    },

    {
        name:"CITY CROSSING",
        start:{x:590,y:850},
        destination:{x:1500,y:850}
    },

    {
        name:"DOWNTOWN MISSION",
        start:{x:1500,y:850},
        destination:{x:2410,y:850}
    },

    {
        name:"SMART CITY RUN",
        start:{x:2410,y:850},
        destination:{x:2410,y:1535}
    },

    {
        name:"FINAL AI MISSION",
        start:{x:2410,y:1535},
        destination:{x:590,y:1535}
    }

];


/* -----------------------------------------------------
   TRAFFIC LIGHTS
----------------------------------------------------- */

const trafficLights = [

    {x:590,y:850},
    {x:1500,y:850},
    {x:2410,y:850},

    {x:590,y:1540},
    {x:1500,y:1540},
    {x:2410,y:1540}

];


/* -----------------------------------------------------
   TRAFFIC
----------------------------------------------------- */

let traffic = [

    {
        x:590,
        y:1200,
        dx:0,
        dy:-1,
        speed:1.5
    },

    {
        x:1500,
        y:1100,
        dx:0,
        dy:1,
        speed:1.4
    },

    {
        x:2410,
        y:1200,
        dx:0,
        dy:-1,
        speed:1.3
    },

    {
        x:950,
        y:850,
        dx:1,
        dy:0,
        speed:1.3
    },

    {
        x:2000,
        y:1540,
        dx:-1,
        dy:0,
        speed:1.4
    }
];


/* -----------------------------------------------------
   PLAYER CAR
----------------------------------------------------- */

const car = {

    x:590,
    y:1900,

    width:38,
    height:62,

    /* IMPORTANT:
       car points UP / vertical */
    angle:-Math.PI / 2,

    speed:0,

    maxSpeed:7,

    acceleration:.20,

    friction:.94,

    steering:.055
};


/* -----------------------------------------------------
   CAMERA
----------------------------------------------------- */

const camera = {

    x:0,
    y:0,

    smooth:.10

};


/* -----------------------------------------------------
   GAME STATE
----------------------------------------------------- */

let currentLevel = 1;

let running = false;

let aiMode = false;

let score = 500;

let frame = 0;

let gameOver = false;


/* -----------------------------------------------------
   KEYBOARD
----------------------------------------------------- */

const keys = {

    up:false,
    down:false,
    left:false,
    right:false,
    space:false

};


document.addEventListener("keydown", function(e){

    const key = e.key.toLowerCase();

    if(
        key === "arrowup" ||
        key === "w"
    ){

        keys.up = true;
        e.preventDefault();

    }

    if(
        key === "arrowdown" ||
        key === "s"
    ){

        keys.down = true;
        e.preventDefault();

    }

    if(
        key === "arrowleft" ||
        key === "a"
    ){

        keys.left = true;
        e.preventDefault();

    }

    if(
        key === "arrowright" ||
        key === "d"
    ){

        keys.right = true;
        e.preventDefault();

    }

    if(key === " "){

        keys.space = true;
        e.preventDefault();

    }

    if(key === "m"){

        aiMode = !aiMode;

        updateUI();

        aiDecision.textContent =
            aiMode
            ? "AI MODE ACTIVE — Autonomous driving enabled."
            : "MANUAL MODE — Use Arrow Keys or WASD.";

    }

    if(key === "r"){

        resetGame();

    }

});


document.addEventListener("keyup", function(e){

    const key = e.key.toLowerCase();

    if(
        key === "arrowup" ||
        key === "w"
    ){
        keys.up = false;
    }

    if(
        key === "arrowdown" ||
        key === "s"
    ){
        keys.down = false;
    }

    if(
        key === "arrowleft" ||
        key === "a"
    ){
        keys.left = false;
    }

    if(
        key === "arrowright" ||
        key === "d"
    ){
        keys.right = false;
    }

    if(key === " "){

        keys.space = false;

    }

});


/* -----------------------------------------------------
   BUTTONS
----------------------------------------------------- */

startBtn.addEventListener("click", function(){

    running = true;
    gameOver = false;

    overlay.classList.remove("show");

    aiDecision.textContent =
        "Driving started. Follow the highlighted destination.";

});


aiBtn.addEventListener("click", function(){

    aiMode = !aiMode;

    updateUI();

});


resetBtn.addEventListener("click", function(){

    resetGame();

});


nextLevelBtn.addEventListener("click", function(){

    if(currentLevel < levels.length){

        currentLevel++;

        loadLevel(currentLevel);

        overlay.classList.remove("show");

        running = true;

    }
    else{

        currentLevel = 1;

        score = 500;

        loadLevel(1);

        overlay.classList.remove("show");

        running = true;

    }

});


/* -----------------------------------------------------
   LOAD LEVEL
----------------------------------------------------- */

function loadLevel(level){

    const data = levels[level - 1];

    car.x = data.start.x;
    car.y = data.start.y;

    /* ALWAYS START STRAIGHT */

    car.angle = -Math.PI / 2;

    car.speed = 0;

    camera.x = car.x - canvas.width / 2;
    camera.y = car.y - canvas.height / 2;

    gameOver = false;

    destinationText.textContent =
        "DESTINATION — " + data.name;

    missionText.textContent =
        "Destination: " + data.name;

    levelText.textContent =
        "LEVEL " + level;

    document.querySelector(".system-box small").textContent =
        "SENSORS ONLINE • GPS • LEVEL " + level;

    updateUI();

}


/* -----------------------------------------------------
   RESET
----------------------------------------------------- */

function resetGame(){

    currentLevel = 1;

    score = 500;

    aiMode = false;

    running = false;

    gameOver = false;

    loadLevel(1);

    overlay.classList.remove("show");

    aiDecision.textContent =
        "Press START and drive your car.";

}


/* -----------------------------------------------------
   ROAD CHECK
----------------------------------------------------- */

function pointOnRoad(x,y){

    for(const road of roads){

        if(
            x >= road.x &&
            x <= road.x + road.w &&
            y >= road.y &&
            y <= road.y + road.h
        ){

            return true;

        }

    }

    return false;

}


/* -----------------------------------------------------
   BUILDING COLLISION
----------------------------------------------------- */

function buildingCollision(){

    const margin = 15;

    for(const b of buildings){

        if(
            car.x + margin > b.x &&
            car.x - margin < b.x + b.w &&
            car.y + margin > b.y &&
            car.y - margin < b.y + b.h
        ){

            return true;

        }

    }

    return false;

}


/* -----------------------------------------------------
   TRAFFIC COLLISION
----------------------------------------------------- */

function trafficCollision(){

    for(const t of traffic){

        const dx = car.x - t.x;
        const dy = car.y - t.y;

        const distance =
            Math.sqrt(dx*dx + dy*dy);

        if(distance < 42){

            return true;

        }

    }

    return false;

}


/* -----------------------------------------------------
   MOVE CAR
----------------------------------------------------- */

function moveCar(){

    const oldX = car.x;
    const oldY = car.y;

    car.x += Math.cos(car.angle) * car.speed;
    car.y += Math.sin(car.angle) * car.speed;

    /* world boundary */

    if(
        car.x < 25 ||
        car.x > WORLD_WIDTH - 25 ||
        car.y < 25 ||
        car.y > WORLD_HEIGHT - 25
    ){

        car.x = oldX;
        car.y = oldY;

        car.speed = 0;

        return;

    }


    /* building collision */

    if(buildingCollision()){

        car.x = oldX;
        car.y = oldY;

        car.speed = 0;

        endGame(
            "GAME OVER",
            "CAR COLLIDED WITH BUILDING"
        );

        return;

    }


    /* traffic collision */

    if(trafficCollision()){

        car.x = oldX;
        car.y = oldY;

        car.speed = 0;

        endGame(
            "GAME OVER",
            "CAR COLLIDED WITH ANOTHER VEHICLE"
        );

        return;

    }

}


/* -----------------------------------------------------
   MANUAL DRIVING
----------------------------------------------------- */

function manualDrive(){

    const level = levels[currentLevel - 1];

    /* accelerate */

    if(keys.up){

        car.speed += car.acceleration;

    }


    /* brake / reverse */

    if(keys.down){

        car.speed -= car.acceleration * 1.3;

    }


    /* friction */

    if(!keys.up && !keys.down){

        car.speed *= car.friction;

    }


    /* steering */

    if(
        keys.left &&
        Math.abs(car.speed) > .15
    ){

        car.angle -= car.steering;

    }


    if(
        keys.right &&
        Math.abs(car.speed) > .15
    ){

        car.angle += car.steering;

    }


    /* emergency brake */

    if(keys.space){

        car.speed *= .55;

        aiDecision.textContent =
            "🛑 EMERGENCY BRAKE ACTIVATED";

    }


    car.speed = Math.max(
        -3,
        Math.min(
            car.maxSpeed,
            car.speed
        )
    );


    moveCar();

}


/* -----------------------------------------------------
   AI DRIVE
----------------------------------------------------- */

function aiDrive(){

    const target =
        levels[currentLevel - 1].destination;

    const dx = target.x - car.x;
    const dy = target.y - car.y;

    const distance =
        Math.sqrt(dx*dx + dy*dy);


    /* determine target direction */

    const targetAngle =
        Math.atan2(dy,dx);


    let difference =
        targetAngle - car.angle;


    while(difference > Math.PI){

        difference -= Math.PI * 2;

    }


    while(difference < -Math.PI){

        difference += Math.PI * 2;

    }


    if(difference > .04){

        car.angle += .035;

    }

    if(difference < -.04){

        car.angle -= .035;

    }


    /* accelerate */

    if(distance > 180){

        car.speed += .14;

    }
    else{

        car.speed -= .08;

    }


    /* traffic detection */

    let danger = false;

    for(const t of traffic){

        const dx2 = t.x - car.x;
        const dy2 = t.y - car.y;

        const d =
            Math.sqrt(dx2*dx2 + dy2*dy2);

        if(d < 100){

            danger = true;

        }

    }


    if(danger){

        car.speed *= .85;

        aiDecision.textContent =
            "AI DECISION: SLOW DOWN — Vehicle detected ahead.";

    }
    else{

        aiDecision.textContent =
            "AI DECISION: DRIVE — Safe route detected.";

    }


    car.speed = Math.max(
        0,
        Math.min(
            car.maxSpeed,
            car.speed
        )
    );


    moveCar();

}


/* -----------------------------------------------------
   TRAFFIC UPDATE
----------------------------------------------------- */

function updateTraffic(){

    for(const t of traffic){

        t.x += t.dx * t.speed;
        t.y += t.dy * t.speed;


        if(t.x < 0){

            t.x = WORLD_WIDTH;

        }

        if(t.x > WORLD_WIDTH){

            t.x = 0;

        }

        if(t.y < 0){

            t.y = WORLD_HEIGHT;

        }

        if(t.y > WORLD_HEIGHT){

            t.y = 0;

        }

    }

}


/* -----------------------------------------------------
   DESTINATION CHECK
----------------------------------------------------- */

function checkDestination(){

    const target =
        levels[currentLevel - 1].destination;

    const dx =
        car.x - target.x;

    const dy =
        car.y - target.y;

    const distance =
        Math.sqrt(dx*dx + dy*dy);


    if(distance < 70){

        completeLevel();

    }

}


/* -----------------------------------------------------
   LEVEL COMPLETE
----------------------------------------------------- */

function completeLevel(){

    running = false;

    car.speed = 0;

    score += 100;

    if(currentLevel < levels.length){

        overlayTitle.textContent =
            "GREAT! LEVEL " +
            currentLevel +
            " DONE";

        overlayMessage.textContent =
            "Mission completed successfully. Get ready for the next city mission.";

        nextLevelBtn.textContent =
            "NEXT LEVEL";

    }
    else{

        overlayTitle.textContent =
            "🏆 ALL 5 LEVELS COMPLETE";

        overlayMessage.textContent =
            "CONGRATULATIONS! AI SMART CITY MISSION COMPLETED.";

        nextLevelBtn.textContent =
            "PLAY AGAIN";

    }

    overlay.classList.add("show");

}


/* -----------------------------------------------------
   GAME OVER
----------------------------------------------------- */

function endGame(title,message){

    running = false;

    gameOver = true;

    overlayTitle.textContent =
        title;

    overlayMessage.textContent =
        message;

    nextLevelBtn.textContent =
        "RESTART";

    overlay.classList.add("show");

}


/* -----------------------------------------------------
   CAMERA
----------------------------------------------------- */

function updateCamera(){

    const targetX =
        car.x - canvas.width / 2;

    const targetY =
        car.y - canvas.height / 2;


    camera.x +=
        (targetX - camera.x) *
        camera.smooth;

    camera.y +=
        (targetY - camera.y) *
        camera.smooth;


    camera.x =
        Math.max(
            0,
            Math.min(
                WORLD_WIDTH - canvas.width,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT - canvas.height,
                camera.y
            )
        );

}


/* -----------------------------------------------------
   DRAW CITY BACKGROUND
----------------------------------------------------- */

function drawBackground(){

    ctx.fillStyle = "#071521";

    ctx.fillRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );


    /* city grid */

    ctx.strokeStyle = "#0b2532";

    ctx.lineWidth = 1;

    for(let x=0;x<WORLD_WIDTH;x+=80){

        ctx.beginPath();

        ctx.moveTo(x,0);

        ctx.lineTo(x,WORLD_HEIGHT);

        ctx.stroke();

    }


    for(let y=0;y<WORLD_HEIGHT;y+=80){

        ctx.beginPath();

        ctx.moveTo(0,y);

        ctx.lineTo(WORLD_WIDTH,y);

        ctx.stroke();

    }

}


/* -----------------------------------------------------
   DRAW ROADS
----------------------------------------------------- */

function drawRoads(){

    for(const road of roads){

        /* road */

        ctx.fillStyle = "#263342";

        ctx.fillRect(
            road.x,
            road.y,
            road.w,
            road.h
        );


        /* road border */

        ctx.strokeStyle = "#12657b";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            road.x,
            road.y,
            road.w,
            road.h
        );


        /* lane lines */

        ctx.strokeStyle = "#ffd900";

        ctx.lineWidth = 4;

        ctx.setLineDash([28,22]);


        /* horizontal */

        if(road.w > road.h){

            const centerY =
                road.y + road.h/2;

            ctx.beginPath();

            ctx.moveTo(
                road.x,
                centerY
            );

            ctx.lineTo(
                road.x + road.w,
                centerY
            );

            ctx.stroke();

        }


        /* vertical */

        else{

            const centerX =
                road.x + road.w/2;

            ctx.beginPath();

            ctx.moveTo(
                centerX,
                road.y
            );

            ctx.lineTo(
                centerX,
                road.y + road.h
            );

            ctx.stroke();

        }

        ctx.setLineDash([]);

    }

}


/* -----------------------------------------------------
   DRAW BUILDINGS
----------------------------------------------------- */

function drawBuildings(){

    for(const b of buildings){

        /* shadow */

        ctx.fillStyle = "#02070d";

        ctx.fillRect(
            b.x + 8,
            b.y + 8,
            b.w,
            b.h
        );


        /* building */

        ctx.fillStyle = "#182535";

        ctx.fillRect(
            b.x,
            b.y,
            b.w,
            b.h
        );


        /* border */

        ctx.strokeStyle = "#38536a";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            b.x,
            b.y,
            b.w,
            b.h
        );


        /* windows */

        const cols =
            Math.max(
                3,
                Math.floor(b.w / 55)
            );

        const rows =
            Math.max(
                3,
                Math.floor(b.h / 55)
            );


        for(let r=0;r<rows;r++){

            for(let c=0;c<cols;c++){

                const wx =
                    b.x + 18 + c*50;

                const wy =
                    b.y + 18 + r*50;


                if(
                    wx + 18 < b.x+b.w-8 &&
                    wy + 18 < b.y+b.h-8
                ){

                    ctx.fillStyle =
                        "#08758c";

                    ctx.fillRect(
                        wx,
                        wy,
                        18,
                        18
                    );

                }

            }

        }

    }

}


/* -----------------------------------------------------
   DRAW TRAFFIC LIGHT
----------------------------------------------------- */

function drawTrafficLights(){

    const state =
        Math.floor(frame / 240) % 3;


    for(const light of trafficLights){

        ctx.fillStyle = "#111820";

        ctx.fillRect(
            light.x - 12,
            light.y - 45,
            24,
            55
        );


        for(let i=0;i<3;i++){

            ctx.beginPath();

            ctx.arc(
                light.x,
                light.y - 34 + i*17,
                5,
                0,
                Math.PI*2
            );


            if(
                (state === 0 && i === 1) ||
                (state === 1 && i === 2) ||
                (state === 2 && i === 0)
            ){

                ctx.fillStyle =
                    i === 0
                    ? "#ff3030"
                    : i === 1
                    ? "#ffd400"
                    : "#00ff88";

            }
            else{

                ctx.fillStyle =
                    "#202a30";

            }

            ctx.fill();

        }

    }


    if(state === 0){

        signalValue.textContent =
            "GREEN";

    }
    else if(state === 1){

        signalValue.textContent =
            "YELLOW";

    }
    else{

        signalValue.textContent =
            "RED";

    }

}


/* -----------------------------------------------------
   DRAW DESTINATION
----------------------------------------------------- */

function drawDestination(){

    const target =
        levels[currentLevel - 1].destination;


    const pulse =
        10 +
        Math.sin(frame * .08) * 5;


    ctx.beginPath();

    ctx.arc(
        target.x,
        target.y,
        35 + pulse,
        0,
        Math.PI*2
    );

    ctx.strokeStyle =
        "#00f6c8";

    ctx.lineWidth = 4;

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        target.x,
        target.y,
        12,
        0,
        Math.PI*2
    );

    ctx.fillStyle =
        "#00ffb7";

    ctx.fill();


    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 20px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "DESTINATION",
        target.x,
        target.y - 55
    );

}


/* -----------------------------------------------------
   DRAW TRAFFIC CARS
----------------------------------------------------- */

function drawTraffic(){

    for(const t of traffic){

        ctx.save();

        ctx.translate(
            t.x,
            t.y
        );


        let angle = 0;

        if(t.dx !== 0){

            angle =
                t.dx > 0
                ? 0
                : Math.PI;

        }
        else{

            angle =
                t.dy > 0
                ? Math.PI/2
                : -Math.PI/2;

        }


        ctx.rotate(angle);


        ctx.fillStyle =
            "#ff426d";

        ctx.fillRect(
            -15,
            -25,
            30,
            50
        );


        ctx.fillStyle =
            "#162c3b";

        ctx.fillRect(
            -10,
            -14,
            20,
            20
        );


        ctx.fillStyle =
            "#ffd800";

        ctx.fillRect(
            -10,
            20,
            6,
            4
        );

        ctx.fillRect(
            4,
            20,
            6,
            4
        );


        ctx.restore();

    }

}


/* -----------------------------------------------------
   DRAW PLAYER CAR
----------------------------------------------------- */

function drawPlayer(){

    ctx.save();


    ctx.translate(
        car.x,
        car.y
    );


    /*
       CAR ALWAYS HAS CORRECT VERTICAL SHAPE.
       Angle starts UP.
    */

    ctx.rotate(
        car.angle + Math.PI/2
    );


    /* glow */

    ctx.shadowBlur = 22;

    ctx.shadowColor =
        "#00eaff";


    /* main body */

    ctx.fillStyle =
        "#00d9ff";

    ctx.fillRect(
        -19,
        -31,
        38,
        62
    );


    ctx.shadowBlur = 0;


    /* roof/window */

    ctx.fillStyle =
        "#102c3c";

    ctx.fillRect(
        -13,
        -18,
        26,
        27
    );


    ctx.fillStyle =
        "#57e8ff";

    ctx.fillRect(
        -10,
        -15,
        20,
        8
    );


    /* front */

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        -12,
        -30,
        8,
        5
    );

    ctx.fillRect(
        4,
        -30,
        8,
        5
    );


    /* rear lights */

    ctx.fillStyle =
        "#ff3155";

    ctx.fillRect(
        -13,
        26,
        8,
        4
    );

    ctx.fillRect(
        5,
        26,
        8,
        4
    );


    /* center line */

    ctx.fillStyle =
        "#07131d";

    ctx.fillRect(
        -2,
        -28,
        4,
        56
    );


    ctx.restore();

}


/* -----------------------------------------------------
   MINIMAP
----------------------------------------------------- */

function drawMinimap(){

    const mw =
        minimap.width;

    const mh =
        minimap.height;


    const sx =
        mw / WORLD_WIDTH;

    const sy =
        mh / WORLD_HEIGHT;


    mctx.fillStyle =
        "#020c14";

    mctx.fillRect(
        0,
        0,
        mw,
        mh
    );


    /* roads */

    mctx.fillStyle =
        "#263342";


    for(const road of roads){

        mctx.fillRect(
            road.x*sx,
            road.y*sy,
            road.w*sx,
            road.h*sy
        );

    }


    /* buildings */

    mctx.fillStyle =
        "#172432";


    for(const b of buildings){

        mctx.fillRect(
            b.x*sx,
            b.y*sy,
            b.w*sx,
            b.h*sy
        );

    }


    /* destination */

    const target =
        levels[currentLevel - 1].destination;


    mctx.fillStyle =
        "#00ffb7";

    mctx.beginPath();

    mctx.arc(
        target.x*sx,
        target.y*sy,
        4,
        0,
        Math.PI*2
    );

    mctx.fill();


    /* traffic */

    mctx.fillStyle =
        "#ff365f";


    for(const t of traffic){

        mctx.fillRect(
            t.x*sx - 2,
            t.y*sy - 2,
            4,
            4
        );

    }


    /* player */

    mctx.fillStyle =
        "#00eaff";

    mctx.beginPath();

    mctx.arc(
        car.x*sx,
        car.y*sy,
        5,
        0,
        Math.PI*2
    );

    mctx.fill();


    /* player direction */

    mctx.strokeStyle =
        "#ffffff";

    mctx.beginPath();

    mctx.moveTo(
        car.x*sx,
        car.y*sy
    );

    mctx.lineTo(
        car.x*sx +
        Math.cos(car.angle)*9,

        car.y*sy +
        Math.sin(car.angle)*9
    );

    mctx.stroke();

}


/* -----------------------------------------------------
   DRAW WORLD
----------------------------------------------------- */

function drawWorld(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.save();


    ctx.translate(
        -camera.x,
        -camera.y
    );


    drawBackground();

    drawRoads();

    drawBuildings();

    drawDestination();

    drawTraffic();

    drawTrafficLights();

    drawPlayer();


    ctx.restore();


    drawMinimap();

}


/* -----------------------------------------------------
   UPDATE UI
----------------------------------------------------- */

function updateUI(){

    speedValue.textContent =
        Math.round(
            Math.abs(car.speed) * 12
        );


    modeValue.textContent =
        aiMode
        ? "AI"
        : "MANUAL";


    aiStatus.textContent =
        running
        ? aiMode
            ? "AUTONOMOUS"
            : "DRIVING"
        : "READY";


    scoreValue.textContent =
        score;


    controlText.textContent =
        aiMode
        ? "● AI AUTONOMOUS CONTROL"
        : "● MANUAL CONTROL";

}


/* -----------------------------------------------------
   GAME LOOP
----------------------------------------------------- */

function gameLoop(){

    frame++;


    if(running && !gameOver){

        if(aiMode){

            aiDrive();

        }
        else{

            manualDrive();

        }


        updateTraffic();

        checkDestination();

        updateCamera();

        updateUI();

    }


    drawWorld();


    requestAnimationFrame(
        gameLoop
    );

}


/* -----------------------------------------------------
   START
----------------------------------------------------- */

loadLevel(1);

updateUI();

drawWorld();

gameLoop();