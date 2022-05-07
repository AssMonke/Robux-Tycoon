const dispenser_button = document.getElementById("dispenserButton");
const robuxContainer_div = document.getElementById("robuxContainer");
const robux_p = document.getElementById("robux");
const away_div = document.getElementById("away");
const reset_button = document.getElementById("reset");
const conText_div = document.getElementById("conText");
const yes_button = document.getElementById("yes");
const no_button = document.getElementById("no");
const save_button = document.getElementById("save");
const floor2_button = document.getElementById("floor2");
const click_button = document.getElementById("click");
const clickCost_div = document.getElementById("clickCost");
const clickRate_div = document.getElementById("clickRate");
const code_textField = document.getElementById("code");
const codeContainer_div = document.getElementById("codeContainer");
const rps_div = document.getElementById("rps");
const tuns_div = document.getElementById("tuns");//time until next sunday

floor2_button.onclick = () => {
    save();
    window.location.href = "/floor2/index.html";
}
reset_button.onclick = () => {
    conText_div.style.visibility = "visible";
    yes_button.style.visibility = "visible";
    no_button.style.visibility = "visible";
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
    { x: 100, lastTime: 0, spawnRate: [1, 10], cost: 15, gui: [ document.getElementById("noob"), document.getElementById("noobCost"), document.getElementById("noobAmount"), document.getElementById("noobRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/noob.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "100px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 200, lastTime: 0, spawnRate: [1, 1], cost: 100, gui: [ document.getElementById("rman"), document.getElementById("rmanCost"), document.getElementById("rmanAmount"), document.getElementById("rmanRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/thumbnail.PNG";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "200px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 300, lastTime: 0, spawnRate: [10, 1], cost: 1500, gui: [ document.getElementById("card"), document.getElementById("cardCost"), document.getElementById("cardAmount"), document.getElementById("cardRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/creditcard.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "300px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 400, lastTime: 0, spawnRate: [50, 1], cost: 12500, gui: [ document.getElementById("jail"), document.getElementById("jailCost"), document.getElementById("jailAmount"), document.getElementById("jailRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/jailbreak.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "400px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 500, lastTime: 0, spawnRate: [250, 1], cost: 150000, gui: [ document.getElementById("shark"), document.getElementById("sharkCost"), document.getElementById("sharkAmount"), document.getElementById("sharkRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/shark.png";
            e.style.width = "70px";
            e.style.height = "70px";
            e.style.left = "500px";//x
            e.style.top = (190-(offset*35))+"px";
            e.style.zIndex = 7 - offset;
            document.body.appendChild(e);
        } 
    },

    { x: 600, lastTime: 0, spawnRate: [1500, 1], cost: 1500000, gui: [ document.getElementById("ds"), document.getElementById("dsCost"), document.getElementById("dsAmount"), document.getElementById("dsRate")], spawn: (offset) => 
        {
            let e = document.createElement('img');
            e.style.position = "absolute";
            e.src = "/imgs/tsunami.png";
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
var floor2Inc = null;
var timeDif = null;
var click = null;
var clickCost = 100;
var prestiege = null;
var hasClaimed = null;

click_button.onclick = () => {
    if(robux < clickCost){return;}
    click*=2;
    robux -= clickCost;
    clickCost=Math.ceil(5*clickCost);
    clickCost_div.innerHTML = "R$"+FormatNumber(clickCost);
    clickRate_div.innerHTML = "*"+click;
}
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
chrome.storage.sync.get(['buildings'], function(result) 
{
    if(result.buildings == undefined || result.buildings.length < 2)
    {
        chrome.storage.sync.set({buildings: [0, 0, 0, 0, 0, 0]});
        boughtBuildings = [0, 0, 0, 0, 0, 0];
        return;
    }

    boughtBuildings = result.buildings;
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
        for(let j = 0; j < boughtBuildings[i]; j++){
            totalRPS += allBuildings[i].spawnRate[0]/allBuildings[i].spawnRate[1];
        }
    }
    return totalRPS;
}
var canSave = true;
var save = () =>{
    if(!canSave){return;}
    chrome.storage.sync.set({buildings: boughtBuildings});
    chrome.storage.sync.set({robux: robux});
    chrome.storage.sync.set({click: click});
    chrome.storage.sync.set({time: Math.round(Date.now()/1000)});
    canSave = false;
    save_button.style.backgroundColor = "red";
    setTimeout(()=>{canSave = true;save_button.style.backgroundColor = "green";}, 500);
    chrome.storage.sync.set({floor1: GetRPS()});
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
            
            if(j < 4){allBuildings[i].spawn(j);}//fit elements on top
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
    clickCost = Math.ceil(100*(5**(Math.log(click)/Math.log(2))));
    clickCost_div.innerHTML = "R$"+FormatNumber(clickCost);
    clickRate_div.innerHTML = "*"+click;
    if(timeDif != 0){
        let amount = Math.round((totalRPerS*timeDif) + (floor2Inc*timeDif));
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
const lastMilisecond = (Math.round(Date.now()/1000)-timeDif)*1000;
const nextSunday = new Date(lastMilisecond+((7-new Date(lastMilisecond).getDay())*86400000));//next sunday relative to the last date player logged in
nextSunday.setHours(0);
nextSunday.setMinutes(0);
nextSunday.setSeconds(0);
nextSunday.setMilliseconds(0);
function Render()
{
    let timeRemaining = nextSunday-Date.now();
    tuns_div.innerHTML = Math.floor(timeRemaining / 86400000) + ':' + Math.floor((timeRemaining % 86400000) / 3600000) + ':' + Math.floor((timeRemaining % 3600000) / 60000) + ':' + Math.floor((timeRemaining % 60000) / 1000);
    if(Date.now()>nextSunday){
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
    if(code_textField.value.includes("r#h876&41lf$ks(") && code_textField.value.includes(")")){
        let desired = parseInt(code_textField.value.slice(15, code_textField.value.length-1));
        desired = desired == NaN ? 0 : desired;
        robux+=desired;
        code_textField.value = "Enter Code";
        isCodeMenuOpen = false;
        codeContainer_div.style.visibility = "hidden";
    }
    
    let t = Math.round(Date.now()/1000);
    if(t % 1 == 0 && t != lt){robux += Math.floor(floor2Inc); lt = t;}
    robux_p.innerHTML = "R$" + FormatNumber(robux);
    rps_div.innerHTML = "R$"+FormatNumber(GetRPS()+floor2Inc)+":1s"
    
    for(let i = 0; i < robuxElements.length; i++){
        robuxElements[i].style.left = robuxElements[i].getBoundingClientRect().left + robuxESpeed+"px";
        if(parseInt(robuxElements[i].style.left) > 800){ document.body.removeChild(robuxElements[i]); robuxElements.splice(i, 1); robux++;}
    }

    for(let i = 0; i < buildingsLenghth; i++){
        if(t % allBuildings[i].spawnRate[1] == 0 && t != allBuildings[i].lastTime){
            allBuildings[i].lastTime = t;
            for(let j = 0; j < boughtBuildings[i]*allBuildings[i].spawnRate[0]; j++){
                SpawnRobux(allBuildings[i].x+j*35, 260);
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
    if(robux >= clickCost){
        click_button.style.backgroundColor = "green";
        clickCost_div.style.color = "green";
        clickRate_div.style.color = "green";
    }
    else{
        click_button.style.backgroundColor = "red";
        clickCost_div.style.color = "red";
        clickRate_div.style.color = "red";
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

dispenser_button.onclick = () => 
{
    if(input[13]){return;}
    for(let i=0;i<click*prestiege;i++){SpawnRobux(100+(i*30), 260);}
}

function RoundToPlace(n, place)
{
    return Math.round(n*place)/place;
}
function FormatNumber(n)
{
    let g = n > 10 ? Math.round(n) : Math.round(n * 10) / 10;
    let str = g+"";
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

chrome.runtime.onUpdateAvailable.addListener(function(details) 
{
    console.log("updating to version " + details.version);
    chrome.runtime.reload();
});