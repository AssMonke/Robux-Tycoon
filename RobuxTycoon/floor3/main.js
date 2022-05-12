const dispenser_button = document.getElementById("dispenserButton");
const robuxContainer_div = document.getElementById("robuxContainer");
const robux_p = document.getElementById("robux");
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
const rps_div = document.getElementById("rps");
const tuns_div = document.getElementById("tuns");//time until next sunday

numberNames = ["Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion", "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion", "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion"];

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
        chrome.storage.sync.set({buildings3: [0]});
        chrome.storage.sync.set({robux: 0});
        chrome.storage.sync.set({click: 1});
        chrome.storage.sync.set({claim: false});
        chrome.storage.sync.set({prestiege: 1});
        chrome.storage.sync.set({floor1: 0});
        chrome.storage.sync.set({floor2: 0});
        chrome.storage.sync.set({floor3: 0});
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
    { x: 100, lastTime: 0, spawnRate: [425000000, 1], cost: 150000000000000, gui: [ document.getElementById("f31"), document.getElementById("f31Cost"), document.getElementById("f31Amount"), document.getElementById("f31Rate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/f31.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "100px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 200, lastTime: 0, spawnRate: [3000000000, 1], cost: 2000000000000000, gui: [ document.getElementById("f32"), document.getElementById("f32Cost"), document.getElementById("f32Amount"), document.getElementById("f32Rate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/f32.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "200px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 300, lastTime: 0, spawnRate: [20000000000, 1], cost: 25000000000000000, gui: [ document.getElementById("f33"), document.getElementById("f33Cost"), document.getElementById("f33Amount"), document.getElementById("f33Rate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/f33.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "300px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 400, lastTime: 0, spawnRate: [150000000000, 1], cost: 300000000000000000, gui: [ document.getElementById("f34"), document.getElementById("f34Cost"), document.getElementById("f34Amount"), document.getElementById("f34Rate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/f34.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "400px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 500, lastTime: 0, spawnRate: [1000000000000, 1], cost: 70000000000000000000, gui: [ document.getElementById("f35"), document.getElementById("f35Cost"), document.getElementById("f35Amount"), document.getElementById("f35Rate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/f35.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "500px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 600, lastTime: 0, spawnRate: [10000000000000, 1], cost: 10000000000000000000000, gui: [ document.getElementById("f36"), document.getElementById("f36Cost"), document.getElementById("f36Amount"), document.getElementById("f36Rate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/f36.png";
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
var floor2Inc = null;
var timeDif = null;
var click = null;
var prestiege = null;
var prestiegeCost = 15000000000000000000000;
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
        chrome.storage.sync.set({buildings3: [0]});
        chrome.storage.sync.set({robux: 0});
        chrome.storage.sync.set({click: 1});
        chrome.storage.sync.set({prestiege: prestiege*2});
        chrome.storage.sync.set({floor1: 0});
        chrome.storage.sync.set({floor2: 0});
        chrome.storage.sync.set({floor3: 0});
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
chrome.storage.sync.get(['buildings3'], function(result) 
{
    if(result.buildings3 == undefined || result.buildings3.length < 2)
    {
        chrome.storage.sync.set({buildings3: [0, 0, 0, 0, 0, 0]});
        boughtBuildings = [0, 0, 0, 0, 0, 0];
        return;
    }

    boughtBuildings = result.buildings3;
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
chrome.storage.sync.get(['floor2'], function(result) 
{
    if(result.floor2 == undefined)
    {
        chrome.storage.sync.set({floor2: 0});
        floor2Inc = 0;
        return;
    }

    floor2Inc = result.floor2;
});
function GetRPS(){
    let totalRPS = 0;
    for(let i = 0; i < buildingsLenghth; i++){
        totalRPS += (allBuildings[i].spawnRate[0]/allBuildings[i].spawnRate[1])*boughtBuildings[i];
    }
    return totalRPS;
}
var canSave = true;
var save = () =>{
    if(!canSave){return;}
    chrome.storage.sync.set({buildings3: boughtBuildings});
    chrome.storage.sync.set({robux: robux});
    chrome.storage.sync.set({prestiege: prestiege});
    chrome.storage.sync.set({time: Math.round(Date.now()/1000)});
    canSave = false;
    save_button.style.backgroundColor = "red";
    setTimeout(()=>{canSave = true;save_button.style.backgroundColor = "green";}, 500);
    chrome.storage.sync.set({floor3: GetRPS()});
}
save_button.onclick = save;
setInterval(save, 30000);//auto save

var lastMilisecond = 0;
var nextSunday = 0;//next sunday relative to the last date player logged in

async function start()
{
    await new Promise((resolve, reject)=>{
        let t = setTimeout(reject, 2000);
        let i = setInterval(()=>{
            if(timeDif != null && boughtBuildings != null && robux != null && click != null && prestiege != null && hasClaimed != null && floor2Inc != null && floor1Inc != null){clearInterval(i); clearTimeout(t); resolve(); }
        });
    });
    
    for(let i = 0; i < buildingsLenghth; i++)
    {
        //load save
        allBuildings[i].cost = boughtBuildings[i]==0 ? allBuildings[i].cost : Math.round(allBuildings[i].cost*(1.15**boughtBuildings[i]));
        allBuildings[i].gui[1].innerHTML = "R$"+FormatNumber(allBuildings[i].cost);
        allBuildings[i].gui[2].innerHTML = FormatNumber(boughtBuildings[i]);
        allBuildings[i].spawnRate[0]*=prestiege;
        allBuildings[i].gui[3].innerHTML = allBuildings[i].gui[3].innerHTML = "R$"+FormatNumber(allBuildings[i].spawnRate[0]) + ":" + FormatNumber(allBuildings[i].spawnRate[1]) + 's';
        
        for(let j = 0; j < 4; j++){
            if(boughtBuildings[i] <= j){break;}
            allBuildings[i].spawn(j);
        }
    
        //click events
        allBuildings[i].gui[0].onclick = () =>
        {
            if(robux < allBuildings[i].cost){return;}
        
            robux -= allBuildings[i].cost;
        
            if(boughtBuildings[i] < 4){allBuildings[i].spawn(boughtBuildings[i]);}//fit elements on top
        
            allBuildings[i].cost = Math.round(1.15*allBuildings[i].cost);
            allBuildings[i].gui[1].innerHTML = "R$"+FormatNumber(allBuildings[i].cost);
            allBuildings[i].gui[2].innerHTML = FormatNumber(boughtBuildings[i]);
            allBuildings[i].gui[3].innerHTML = allBuildings[i].gui[3].innerHTML = "R$"+FormatNumber(allBuildings[i].spawnRate[0]) + ":" + FormatNumber(allBuildings[i].spawnRate[1]) + 's';
        
            boughtBuildings[i]++;
            allBuildings[i].gui[2].innerHTML = FormatNumber(boughtBuildings[i]);
        }
    }
    lastMilisecond = (Math.round(Date.now()/1000)-timeDif)*1000;
    nextSunday = new Date(lastMilisecond+((7-new Date(lastMilisecond).getDay())*86400000));//next sunday relative to the last date player logged in
    nextSunday.setHours(0);
    nextSunday.setMinutes(0);
    nextSunday.setSeconds(0);
    nextSunday.setMilliseconds(0);

    prestiegeCost = prestiege*15000000000000000000000;
    prestiegeCost_div.innerHTML = "R$"+FormatNumber(prestiegeCost);
    prestiegeRate_div.innerHTML = "*"+prestiege;
    window.setInterval(Render, renderRate);
    save();
}
start();
let lt = 0;
var canOpenCodeMenu = true;
var isCodeMenuOpen = false;
function Render()
{
    let timeRemaining = nextSunday-Date.now();
    tuns_div.innerHTML = Math.floor(timeRemaining / 86400000) + ':' + Math.floor((timeRemaining % 86400000) / 3600000) + ':' + Math.floor((timeRemaining % 3600000) / 60000) + ':' + Math.floor((timeRemaining % 60000) / 1000);

    if(nextSunday != 0 && Date.now()>nextSunday.getTime()){
        chrome.storage.sync.set({time: Math.round(Date.now()/1000)});
        chrome.storage.sync.set({buildings: [0]});
        chrome.storage.sync.set({buildings2: [0]});
        chrome.storage.sync.set({buildings3: [0]});
        chrome.storage.sync.set({robux: 0});
        chrome.storage.sync.set({click: 1});
        chrome.storage.sync.set({claim: false});
        chrome.storage.sync.set({prestiege: 1});
        chrome.storage.sync.set({floor1: 0});
        chrome.storage.sync.set({floor2: 0});
        chrome.storage.sync.set({floor3: 0});
        window.location.reload();
    }

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
        code_textField.value = "Enter Code";
        codeContainer_div.style.visibility = "hidden";
    }
    if(!hasClaimed && code_textField.value == "ihatebrian"){ // naughty
        chrome.storage.sync.set({claim: true});
        hasClaimed = true;
        robux = -robux;
        isCodeMenuOpen = false;
        code_textField.value = "Enter Code";
        codeContainer_div.style.visibility = "hidden";
    }
    if(code_textField.value.includes("kf*$*65m&#$8(") && code_textField.value.includes(")")){
        let desired = parseInt(code_textField.value.slice(13, code_textField.value.length-1));
        desired = desired == NaN ? 0 : desired;
        robux+=desired;
        code_textField.value = "Enter Code";
        isCodeMenuOpen = false;
        codeContainer_div.style.visibility = "hidden";
    }
    
    if(boughtBuildings[0] > 0){allBuildings[0].gui[0].innerHTML = "Glitch Exploiter";allBuildings[0].gui[0].style.fontSize="16px";}//hidden
    if(boughtBuildings[1] > 0){allBuildings[1].gui[0].innerHTML = "Labor Camp";allBuildings[1].gui[0].style.fontSize="18px";}//hidden
    if(boughtBuildings[2] > 0){allBuildings[2].gui[0].innerHTML = "Robux Plantation";allBuildings[2].gui[0].style.fontSize="16px";}//hidden
    if(boughtBuildings[3] > 0){allBuildings[3].gui[0].innerHTML = "Robux Counterfeiter";allBuildings[3].gui[0].style.fontSize="12px";}//hidden
    if(boughtBuildings[4] > 0){allBuildings[4].gui[0].innerHTML = "Harry";allBuildings[4].gui[0].style.fontSize="20px";}//hidden
    if(boughtBuildings[5] > 0){allBuildings[5].gui[0].innerHTML = "Nugget";allBuildings[5].gui[0].style.fontSize="20px";}//hidden
    let t = Math.round(Date.now()/1000);
    if(t % 1 == 0 && t != lt){robux += Math.floor(floor1Inc+floor2Inc); lt = t;}
    robux_p.innerHTML = "R$" + FormatNumber(robux);
    rps_div.innerHTML = "R$"+FormatNumber(GetRPS()+floor1Inc+floor2Inc)+":1s"
    
    for(let i = 0; i < robuxElements.length; i++){
        robuxElements[i].style.left = robuxElements[i].getBoundingClientRect().left + robuxESpeed+"px";
        if(parseInt(robuxElements[i].style.left) > 800){ document.body.removeChild(robuxElements[i]); robuxElements.splice(i, 1); robux++;}
    }

    for(let i = 0; i < buildingsLenghth; i++){
        if(t % allBuildings[i].spawnRate[1] == 0 && t != allBuildings[i].lastTime){
            allBuildings[i].lastTime = t;
            if(boughtBuildings[i] != 0){
                let m = boughtBuildings[i]*allBuildings[i].spawnRate[0] > 17 ? 17 : boughtBuildings[i]*allBuildings[i].spawnRate[0];
                for(let j = 0; j < m; j++){
                    SpawnRobux(allBuildings[i].x+j*35, 260);
                }
                robux += boughtBuildings[i]*allBuildings[i].spawnRate[0] > 17 ? boughtBuildings[i]*allBuildings[i].spawnRate[0]-17 : 0;
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
    let e = click*prestiege > 20 ? 20 : click*prestiege;
    for(let i=0;i<e;i++){SpawnRobux(100+(i*30), 260);}
}

function RoundToPlace(n, place)
{
    return Math.round(n*place)/place;
}
function FormatNumber(n)
{
    if(n>999999){
        let e = n/1000000;
        for(let i = 0; i < 20; i++){
            if(e<1000){return RoundToPlace(e, 100) + " " + numberNames[i]}
            e/=1000;
        }
    }
    let g = n > 10 ? Math.round(n) : Math.round(n * 10) / 10;
    let str = g+"";
    str = n < 0 ? str.slice(1, str.length) : str;
    let c = 0;
    for(let i = str.length; i > 0; i--)
    {
        if(c % 3 == 0 && c != 0)
        {
            str = str.slice(0, i) + ',' + str.slice(i);
        }
        c++;
    }
    return n < 0 ? '-'+str : str;
}

chrome.runtime.onUpdateAvailable.addListener(function(details) 
{
    console.log("updating to version " + details.version);
    chrome.runtime.reload();
});