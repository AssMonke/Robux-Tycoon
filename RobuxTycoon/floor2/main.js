const dispenser_button = document.getElementById("dispenserButton");
const robuxContainer_div = document.getElementById("robuxContainer");
const robux_p = document.getElementById("robux");
const away_div = document.getElementById("away");
const reset_button = document.getElementById("reset");
const conText_div = document.getElementById("conText");
const yes_button = document.getElementById("yes");
const no_button = document.getElementById("no");
const save_button = document.getElementById("save");
const floor1_button = document.getElementById("floor1");
const prestiege_button = document.getElementById("prestiege");
const prestiegeCost_div = document.getElementById("prestiegeCost");
const prestiegeRate_div = document.getElementById("prestiegeRate");
const code_textField = document.getElementById("code");
const codeContainer_div = document.getElementById("codeContainer");

floor1_button.onclick = () => {
    save();
    window.location.href = "/floor1/index.html";
}
reset_button.onclick = () => {
    conText_div.style.visibility = "visible";
    yes_button.style.visibility = "visible";
    no_button.style.visibility = "visible";
    conText_div.innerHTML = "Are you sure you want to reset all data? This cannot be undone.";
    yes_button.onclick = () => {
        chrome.storage.sync.set({buildings: [0]});
        chrome.storage.sync.set({buildings2: [0]});
        chrome.storage.sync.set({robux: 0});
        chrome.storage.sync.set({click: 1});
        chrome.storage.sync.set({claim: false});
        chrome.storage.sync.set({prestiege: 1});
        chrome.storage.sync.set({floor1: 0});
        chrome.storage.sync.set({floor2: 0});
        window.location.reload();
    }
    no_button.onclick = () => {
        conText_div.style.visibility = "hidden";
        yes_button.style.visibility = "hidden";
        no_button.style.visibility = "hidden";
        yes_button.onclick = null;
    }
}

const renderRate = 30;
const robuxESpeed = 10;

var input = [];
var handleInput = (event) => { input[event.keyCode] = event.type == 'keydown'; }
document.addEventListener('keydown', handleInput);
document.addEventListener('keyup', handleInput);

const allBuildings = 
[
    { x: 100, lastTime: 0, spawnRate: [8000, 1], cost: 20000000, gui: [ document.getElementById("mine"), document.getElementById("mineCost"), document.getElementById("mineAmount"), document.getElementById("mineRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/mine.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "100px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 200, lastTime: 0, spawnRate: [50000, 1], cost: 300000000, gui: [ document.getElementById("printer"), document.getElementById("printerCost"), document.getElementById("printerAmount"), document.getElementById("printerRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/printer.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "200px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 300, lastTime: 0, spawnRate: [250000, 1], cost: 5000000000, gui: [ document.getElementById("child"), document.getElementById("childCost"), document.getElementById("childAmount"), document.getElementById("childRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/child.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "300px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 400, lastTime: 0, spawnRate: [1500000, 1], cost: 75000000000, gui: [ document.getElementById("dominus"), document.getElementById("dominusCost"), document.getElementById("dominusAmount"), document.getElementById("dominusRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/dominus.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "400px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 500, lastTime: 0, spawnRate: [10000000, 1], cost: 1000000000000, gui: [ document.getElementById("admin"), document.getElementById("adminCost"), document.getElementById("adminAmount"), document.getElementById("adminRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/admin.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "500px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 600, lastTime: 0, spawnRate: [50000000000, 1], cost: 15000000000000, gui: [ document.getElementById("fire"), document.getElementById("fireCost"), document.getElementById("fireAmount"), document.getElementById("fireRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/firehacks.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "600px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    }
];
const buildingsLenghth = allBuildings.length;

var boughtBuildings = null;
var robuxElements = [];
var robux = null;
var floor1Inc = null;
var timeDif = null;
var click = null;
var prestiege = null;
var prestiegeCost = 12500000000000;
var hasClaimed = null;

prestiege_button.onclick = ()=>{
    if(robux < prestiegeCost){return;}
    conText_div.style.visibility = "visible";
    yes_button.style.visibility = "visible";
    no_button.style.visibility = "visible";
    conText_div.innerHTML = "Are you sure you want to reset all data? You will restart with an additonal x2 multiplyer on all robux.";
    yes_button.onclick = () => {
        chrome.storage.sync.set({buildings: [0]});
        chrome.storage.sync.set({buildings2: [0]});
        chrome.storage.sync.set({robux: 0});
        chrome.storage.sync.set({click: 1});
        chrome.storage.sync.set({prestiege: prestiege*2});
        chrome.storage.sync.set({floor1: 0});
        chrome.storage.sync.set({floor2: 0});
        window.location.reload();
    }
    no_button.onclick = () => {
        conText_div.style.visibility = "hidden";
        yes_button.style.visibility = "hidden";
        no_button.style.visibility = "hidden";
        yes_button.onclick = null;
    }
}
chrome.storage.sync.get(['prestiege'], function(result) 
{
    if(result.prestiege == undefined)
    {
        chrome.storage.sync.set({prestiege: 1});
        prestiege = 1;
        return;
    }

    prestiege = result.prestiege;
});
chrome.storage.sync.get(['claim'], function(result) 
{
    if(result.claim == undefined)
    {
        chrome.storage.sync.set({claim: false});
        hasClaimed = false;
        return;
    }

    hasClaimed = result.claim;
});
chrome.storage.sync.get(['click'], function(result) 
{
    if(result.click == undefined)
    {
        chrome.storage.sync.set({click: 1});
        click = 1;
        return;
    }

    click = result.click;
});
chrome.storage.sync.get(['robux'], function(result) 
{
    if(result.robux == undefined)
    {
        chrome.storage.sync.set({robux: 0});
        robux = 0;
        return;
    }

    robux = result.robux;
});
chrome.storage.sync.get(['buildings2'], function(result) 
{
    if(result.buildings2 == undefined || result.buildings2.length < 2)
    {
        chrome.storage.sync.set({buildings2: [0, 0, 0, 0, 0, 0]});
        boughtBuildings = [0, 0, 0, 0, 0, 0];
        return;
    }

    boughtBuildings = result.buildings2;
});
chrome.storage.sync.get(['time'], function(result) 
{
    if(result.time == undefined)
    {
        chrome.storage.sync.set({time: Math.round(Date.now()/1000)});
        timeDif = Math.round(Date.now()/1000);
        return;
    }

    timeDif = Math.round(Date.now()/1000) - result.time;
});
chrome.storage.sync.get(['floor1'], function(result) 
{
    if(result.floor1 == undefined)
    {
        chrome.storage.sync.set({floor1: 0});
        floor1Inc = 0;
        return;
    }

    floor1Inc = result.floor1;
});

var canSave = true;
var save = () =>{
    if(!canSave){return;}
    chrome.storage.sync.set({buildings2: boughtBuildings});
    chrome.storage.sync.set({robux: robux});
    chrome.storage.sync.set({prestiege: prestiege});
    chrome.storage.sync.set({time: Math.round(Date.now()/1000)});
    canSave = false;
    save_button.style.backgroundColor = "red";
    setTimeout(()=>{canSave = true;save_button.style.backgroundColor = "green";}, 500);
    let totalRPerS = 0;
    for(let i = 0; i < buildingsLenghth; i++){
        for(let j = 0; j < boughtBuildings[i]; j++){
            totalRPerS += allBuildings[i].spawnRate[0]/allBuildings[i].spawnRate[1];
        }
    }
    chrome.storage.sync.set({floor2: totalRPerS});
}
save_button.onclick = save;
setInterval(save, 30000);//auto save
async function start()
{
    await new Promise((resolve, reject)=>{
        let t = setTimeout(reject, 2000);
        let i = setInterval(()=>{
            if(timeDif != null && boughtBuildings != null && robux != null && click != null && prestiege != null && hasClaimed != null){clearInterval(i); clearTimeout(t); resolve(); }
        });
    });
    
    let totalRPerS = 0;
    for(let i = 0; i < buildingsLenghth; i++)
    {
        //load save
        allBuildings[i].cost = allBuildings[i].cost*(1.15**boughtBuildings[i])==0 ? allBuildings[i].cost : Math.round(allBuildings[i].cost*(1.15**boughtBuildings[i]));
        allBuildings[i].gui[1].innerHTML = "R$"+FormatNumber(allBuildings[i].cost);
        allBuildings[i].gui[2].innerHTML = FormatNumber(boughtBuildings[i]);
        allBuildings[i].spawnRate[0]*=prestiege;
        allBuildings[i].gui[3].innerHTML = allBuildings[i].gui[3].innerHTML = "R$"+FormatNumber(allBuildings[i].spawnRate[0]) + ":" + FormatNumber(allBuildings[i].spawnRate[1]) + 's';
        for(let j = 0; j < boughtBuildings[i]; j++){
            totalRPerS += allBuildings[i].spawnRate[0]/allBuildings[i].spawnRate[1];
            
            if(j < 5){allBuildings[i].spawn(j);}//fit elements on top
        }
    
        //click events
        allBuildings[i].gui[0].onclick = () =>
        {
            if(robux < allBuildings[i].cost){return;}
        
            robux -= allBuildings[i].cost;
        
            if(boughtBuildings[i] < 5){allBuildings[i].spawn(boughtBuildings[i]);}//fit elements on top
        
            allBuildings[i].cost = Math.round(1.15*allBuildings[i].cost);
            allBuildings[i].gui[1].innerHTML = "R$"+FormatNumber(allBuildings[i].cost);
            allBuildings[i].gui[2].innerHTML = FormatNumber(boughtBuildings[i]);
            allBuildings[i].gui[3].innerHTML = allBuildings[i].gui[3].innerHTML = "R$"+FormatNumber(allBuildings[i].spawnRate[0]) + ":" + FormatNumber(allBuildings[i].spawnRate[1]) + 's';
        
            boughtBuildings[i]++;
            allBuildings[i].gui[2].innerHTML = FormatNumber(boughtBuildings[i]);
        }
    }
    prestiegeCost = prestiege*12500000000000;
    prestiegeCost_div.innerHTML = "R$"+FormatNumber(prestiegeCost);
    prestiegeRate_div.innerHTML = "*"+prestiege;
    if(timeDif != 0 && totalRPerS != 0){
        let amount = Math.ceil(totalRPerS*timeDif);
        let t = timeDif > 60 ? RoundToPlace(timeDif / 60, 100) +' minutes' : timeDif+' seconds';
        t = timeDif > 3600 ? RoundToPlace(timeDif / 3600, 100) +' hours' : t;
        t = timeDif > 86400 ? RoundToPlace(timeDif / 86400, 100) +' days' : t;
        t = timeDif > 2629800 ? RoundToPlace(timeDif / 2629800, 100) +' months' : t;
        t = timeDif > 31557600 ? RoundToPlace(timeDif / 31557600, 100) +' years' : t;
        away_div.innerHTML = "You were gone for " + t + " and earned " + "R$"+ FormatNumber(amount);
        setTimeout(()=>{document.body.removeChild(away_div);}, 2000);
        robux += amount;
    }
    else{document.body.removeChild(away_div);}
    window.setInterval(Render, renderRate);
    save();
}
start();
let lt = 0;
var canOpenCodeMenu = true;
var isCodeMenuOpen = false;
function Render()
{
    if(input[67] && canOpenCodeMenu){
        isCodeMenuOpen = !isCodeMenuOpen;
        codeContainer_div.style.visibility = isCodeMenuOpen ? "visible" : "hidden";
        canOpenCodeMenu = false;
        setTimeout(() => {
            canOpenCodeMenu = true;
        }, 500);
    }
    if(!hasClaimed && code_textField.value == "ilovebrian"){ // you are not supposed to be looking at this...
        chrome.storage.sync.set({claim: true});
        hasClaimed = true;
        robux += 1000000;
        isCodeMenuOpen = false;
        codeContainer_div.style.visibility = "hidden";
    }
    
    if(boughtBuildings[4] > 0 || boughtBuildings[5] > 0){allBuildings[5].gui[0].innerHTML = "FireHacks123";allBuildings[5].gui[0].style.fontSize="12px";}//reveal it at the end
    let t = Math.round(Date.now()/1000);
    if(t % 1 == 0 && t != lt){robux += Math.floor(floor1Inc); lt = t;}
    robux_p.innerHTML = "R$" + FormatNumber(robux);
    
    for(let i = 0; i < robuxElements.length; i++){
        robuxElements[i].style.left = robuxElements[i].getBoundingClientRect().left + robuxESpeed+"px";
        if(parseInt(robuxElements[i].style.left) > 800){ document.body.removeChild(robuxElements[i]); robuxElements.splice(i, 1); robux++;}
    }

    for(let i = 0; i < buildingsLenghth; i++){
        if(t % allBuildings[i].spawnRate[1] == 0 && t != allBuildings[i].lastTime){
            allBuildings[i].lastTime = t;
            if(boughtBuildings[i]*allBuildings[i].spawnRate[0] > 50000){robux+=boughtBuildings[i]*allBuildings[i].spawnRate[0];}
            else{
                for(let j = 0; j < boughtBuildings[i]*allBuildings[i].spawnRate[0]; j++){
                    SpawnRobux(allBuildings[i].x+j*35, 260);
                }
            }
            
        }
        
        // gui
        if(robux >= allBuildings[i].cost){
            allBuildings[i].gui[0].style.backgroundColor = "green";
            allBuildings[i].gui[1].style.color = "green";
            allBuildings[i].gui[2].style.color = "green";
            allBuildings[i].gui[3].style.color = "green";
        }
        else{
            allBuildings[i].gui[0].style.backgroundColor = "red";
            allBuildings[i].gui[1].style.color = "red";
            allBuildings[i].gui[2].style.color = "red";
            allBuildings[i].gui[3].style.color = "red";
        }
    }
    if(robux >= prestiegeCost){
        prestiege_button.style.backgroundColor = "green";
        prestiegeCost_div.style.color = "green";
        prestiegeRate_div.style.color = "green";
    }
    else{
        prestiege_button.style.backgroundColor = "red";
        prestiegeCost_div.style.color = "red";
        prestiegeRate_div.style.color = "red";
    }
}

function SpawnRobux(x, y)
{
    if(robuxElements.length > 100){robux++; return;}
    let r = document.createElement('img');
    r.style.position = "absolute";
    r.src = "/imgs/coin.png";
    r.style.width = "35px";
    r.style.height = "35px";
    r.style.left = x+"px";
    r.style.top = y+"px";
    document.body.appendChild(r);

    robuxElements.push(r);
}

var enter = false;
var handleInput = (event) => { enter = event.keyCode == 13; }
document.addEventListener('keydown', handleInput);
document.addEventListener('keyup', handleInput);

dispenser_button.onclick = () => 
{
    if(enter){return;}
    for(let i=0;i<click*prestiege;i++){SpawnRobux(100+(i*30), 260);}
}

function RoundToPlace(n, place)
{
    return Math.round(n*place)/place;
}
function FormatNumber(n)
{
    let str = n+"";
    let c = 0;
    for(let i = str.length; i > 0; i--)
    {
        if(c % 3 == 0 && c != 0)
        {
            str = str.slice(0, i) + ',' + str.slice(i);
        }
        c++;
    }
    return str;
}