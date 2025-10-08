// JavaScript for thing/Index.html
// All code moved from the HTML file

// Initialize level dropdowns
const levelDropdown = document.getElementById('levelDropdown');
const editLevelDropdown = document.getElementById('editLevelDropdown');
for (let i = 1; i <= 50; i++) {
    const option = document.createElement('option');
    option.value = 'Level ' + i;
    option.textContent = 'Level ' + i;
    levelDropdown.appendChild(option);
    const editOption = document.createElement('option');
    editOption.value = 'Level ' + i;
    editOption.textContent = 'Level ' + i;
    editLevelDropdown.appendChild(editOption);
}

// Overlay functionality
const editBtn = document.getElementById('editBtn');
const editOverlay = document.getElementById('editOverlay');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const pfpInput = document.getElementById('pfpInput');

// Show overlay
editBtn.addEventListener('click', () => {
    loadCurrentValues();
    editOverlay.style.display = 'flex';
});

// Hide overlay
cancelBtn.addEventListener('click', () => {
    editOverlay.style.display = 'none';
});

// Close overlay when clicking outside modal
editOverlay.addEventListener('click', (e) => {
    if (e.target === editOverlay) {
        editOverlay.style.display = 'none';
    }
});

// Profile picture functionality
pfpInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('editPfp').src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
    }
});

// Load current values into edit modal
function loadCurrentValues() {
    document.getElementById('editChName').value = document.getElementById('ChName').value || '';
    document.getElementById('editChGCR').value = document.getElementById('ChGCR').value || '';
    document.getElementById('editLevelDropdown').value = document.getElementById('levelDropdown').value || 'Level 1';
    document.getElementById('editPfp').src = document.getElementById('pfp').src;
    document.getElementById('editRaceSize').value = document.getElementById('ChRaceSize').value || 'Medium';
    const stats = ['ws', 'bs', 'str', 'tn', 'dex', 'int', 'per', 'wp', 'fel'];
    stats.forEach(stat => {
        const container = document.getElementById(stat);
        const displayBase = parseInt(container.querySelector('input:nth-child(1)').value) || 1;
        const displayBonus = parseInt(container.querySelector('input:nth-child(3)').value) || 0; 
        document.getElementById(`edit-${stat}-base`).value = Math.max(1, displayBase);
        document.getElementById(`edit-${stat}-bonus`).value = displayBonus || '';
    });
    updatePointsRemaining();
    document.getElementById('editWoundsName').value = document.querySelector('#cb-body .cb-grupe:first-child #cb-name').value;
    document.getElementById('editWoundsMod').value = document.getElementById('Modcb').value;
    document.getElementById('editStaminaName').value = document.querySelector('#cb-body .cb-grupe:nth-child(2) #cb-name').value;
    document.getElementById('editStaminaMod').value = document.getElementById('Modcb1').value;
}

let pointsUsed = 0;
const basePoints = 9;
const minStat = 1;
const maxStat = 10;

function getMaxPoints() {
    const levelText = document.getElementById('editLevelDropdown').value || 'Level 1';
    const level = parseInt(levelText.replace('Level ', '')) || 1;
    if (level === 1) {
        return basePoints;
    }
    return basePoints + (level - 1);
}

function updatePointsRemaining() {
    const stats = ['ws', 'bs', 'str', 'tn', 'dex', 'int', 'per', 'wp', 'fel'];
    pointsUsed = 0;
    stats.forEach(stat => {
        const baseValue = parseInt(document.getElementById(`edit-${stat}-base`).value) || 1;
        pointsUsed += (baseValue - 1);
    });
    const maxPoints = getMaxPoints();
    const remaining = maxPoints - pointsUsed;
    document.getElementById('pointsRemaining').textContent = remaining;
    document.getElementById('maxPointsDisplay').textContent = maxPoints;
    stats.forEach(stat => {
        const base = parseInt(document.getElementById(`edit-${stat}-base`).value) || 1;
        const bonus = parseInt(document.getElementById(`edit-${stat}-bonus`).value) || 0;
        document.getElementById(`${stat}-total`).textContent = base + bonus;
    });
    return remaining;
}

document.getElementById('editLevelDropdown').addEventListener('change', updatePointsRemaining);
document.querySelectorAll('.point-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const stat = this.dataset.stat;
        const action = this.dataset.action;
        const input = document.getElementById(`edit-${stat}-base`);
        let value = parseInt(input.value) || 1;
        if (action === 'plus') {
            const remaining = updatePointsRemaining();
            if (value < maxStat && remaining > 0) {
                input.value = value + 1;
            }
        } else if (action === 'minus') {
            if (value > minStat) {
                input.value = value - 1;
            }
        }
        updatePointsRemaining();
    });
});
document.querySelectorAll('[id$="-bonus"]').forEach(input => {
    input.addEventListener('input', updatePointsRemaining);
});
document.getElementById('editRaceSize').addEventListener('change', () => {
     updatePointsRemaining();
     updateStats();
});

saveBtn.addEventListener('click', () => {
    document.getElementById('ChName').value = document.getElementById('editChName').value;
    document.getElementById('ChGCR').value = document.getElementById('editChGCR').value;
    document.getElementById('levelDropdown').value = document.getElementById('editLevelDropdown').value;
    document.getElementById('pfp').src = document.getElementById('editPfp').src;
    document.getElementById('ChRaceSize').value = document.getElementById('editRaceSize').value;
    const stats = ['ws', 'bs', 'str', 'tn', 'dex', 'int', 'per', 'wp', 'fel'];
    stats.forEach(stat => {
        const container = document.getElementById(stat);
        // Update the main view stat input fields with modal values
        const base = parseInt(document.getElementById(`edit-${stat}-base`).value) || 1;
        const bonus = parseInt(document.getElementById(`edit-${stat}-bonus`).value) || 0;
        // The first input is Base (point buy)
        const input1 = container.querySelector('input[type="text"]:nth-child(1)');
        // The third input is Bonus (race/other)
        const input2 = container.querySelector('input[type="text"]:nth-child(3)');
        if (input1) input1.value = base;
        if (input2) input2.value = bonus;
    });
    document.querySelector('#cb-body .cb-grupe:first-child #cb-name').value = document.getElementById('editWoundsName').value;
    document.getElementById('Modcb').value = document.getElementById('editWoundsMod').value;
    document.querySelector('#cb-body .cb-grupe:nth-child(2) #cb-name').value = document.getElementById('editStaminaName').value;
    document.getElementById('Modcb1').value = document.getElementById('editStaminaMod').value;
    updateStats();
    editOverlay.style.display = 'none';
});

const stats = ['ws', 'bs', 'str', 'tn', 'dex', 'per','int', 'wp', 'fel'];
function updateStats() {
    const cbContainer = document.getElementById('cb-container');
    const cbContainer1 = document.getElementById('cb-container1');
    const Modcb = document.getElementById('Modcb');
    const Modcb1 = document.getElementById('Modcb1');
    let dexTotal = 0;
    stats.forEach(stat => {
        const container = document.getElementById(stat);
        // Always select the first and second input[type="text"] for base and bonus
        const inputs = container.querySelectorAll('input[type="text"]');
        const input1 = inputs[0];
        const input2 = inputs[1];
        const total = container.querySelector(`#${stat}Total`);
        const val1 = parseInt(input1 && input1.value) || 0;
        const val2 = parseInt(input2 && input2.value) || 0;
        let totol = val1 + val2;
        if (totol > 15) {
            totol = 15;
        }
        total.textContent = totol;  
        if (stat === 'dex') {
            dexTotal = totol;
        }
    });
    const selectedSize = document.getElementById('ChRaceSize').value; 
    let baseMove = 0;
    switch (selectedSize) {
        case 'Small':
            baseMove = 4;
            break;
        case 'Medium':
            baseMove = 5;
            break;
        case 'Large':
            baseMove = 6;
            break;
        default:
            baseMove = 5;
    }
    const dexBonusMove = Math.floor(dexTotal / 5);
    let totalMoveSpeed = baseMove + dexBonusMove;
    document.getElementById('moveSpeedDisplay').value = totalMoveSpeed;
    // Also display move speed in the 'Other' section under Actions
    var moveSpeedOtherBox = document.getElementById('moveSpeedDisplayOtherBox');
    if (moveSpeedOtherBox) {
        moveSpeedOtherBox.textContent = totalMoveSpeed;
    }
    let mod = Modcb.value || 3;
    let mod1 = Modcb1.value || 4;
    let cbcont = document.querySelector(`#tnTotal`).textContent * mod;
    cbContainer.innerHTML = '';
    for (let i = 0; i < cbcont; i++) {
        let labelNum = i + 1;
        const cbwrapper = document.createElement('div');
        cbwrapper.className = 'cb-wrapper';
        cbContainer.appendChild(cbwrapper);
        cbwrapper.style.position = 'relative';
        cbwrapper.style.display = 'inline-block';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'cb'+ labelNum;
        cbwrapper.appendChild(cb);
        const label = document.createElement('label');
        label.htmlFor = 'cb'+ labelNum;
        label.textContent = labelNum;
        cbwrapper.appendChild(label);
        label.style.position = 'absolute';
        label.style.right = '8px';
        label.style.top = '8px';
        label.style.pointerEvents = 'none';
    }
    let cbcont1 = document.querySelector(`#dexTotal`).textContent * mod1;
    cbContainer1.innerHTML = '';
    for (let i = 0; i < cbcont1; i++) {
        let labelNum = i + 1;
        const cbwrapper = document.createElement('div');
        cbwrapper.className = 'cb-wrapper';
        cbContainer1.appendChild(cbwrapper);
        cbwrapper.style.position = 'relative';
        cbwrapper.style.display = 'inline-block';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = 'cb'+ labelNum;
        cbwrapper.appendChild(cb);
        const label = document.createElement('label');
        label.htmlFor = 'cb'+ labelNum;
        label.textContent = labelNum;
        cbwrapper.appendChild(label);
        label.style.position = 'absolute';
        label.style.right = '8px';
        label.style.top = '8px';
        label.style.pointerEvents = 'none';
        label.style.color = 'var(--text)';
    }
}
updateStats();
const actionsTab = document.getElementById('actionsTab');
const traitsTab = document.getElementById('traitsTab');
const inventoryTab = document.getElementById('inventoryTab');
const actions = document.getElementById('Actions');
const traits = document.getElementById('Traits');
const inventory = document.getElementById('Inventory');
const updateActionsTab = () => {
    actions.style.display = 'block';
    traits.style.display = 'none';
    inventory.style.display = 'none';
    actionsTab.style.backgroundColor = 'var(--accent)';
    traitsTab.style.backgroundColor = 'var(--main-color)';
    inventoryTab.style.backgroundColor = 'var(--main-color)';
}
const updateTraitsTab = () => {
    actions.style.display = 'none';
    traits.style.display = 'block';
    inventory.style.display = 'none';
    actionsTab.style.backgroundColor = 'var(--main-color)';
    traitsTab.style.backgroundColor = 'var(--accent)';
    inventoryTab.style.backgroundColor = 'var(--main-color)';
}
const updateInventoryTab = () => {
    actions.style.display = 'none';
    traits.style.display = 'none';
    inventory.style.display = 'block';
    actionsTab.style.backgroundColor = 'var(--main-color)';
    traitsTab.style.backgroundColor = 'var(--main-color)';
    inventoryTab.style.backgroundColor = 'var(--accent)';
}
actionsTab.addEventListener('click', updateActionsTab);
traitsTab.addEventListener('click', updateTraitsTab);
inventoryTab.addEventListener('click', updateInventoryTab);
updateActionsTab();
const addtbbtn = ['addtbbtn1', 'addtbbtn2', 'addtbbtn3', 'addtbbtn4', 'addtbbtn5', 'addtbbtn6', 'addtbbtn7','addtbbtn8'];
const TBContainer = ['TBContainer1', 'TBContainer2', 'TBContainer3', 'TBContainer4', 'TBContainer5', 'TBContainer6', 'TBContainer7','TBContainer8'];
addtbbtn.forEach((btnId, i) => {
    document.getElementById(btnId).onclick = () => {
        const ta = document.createElement('textarea');
        ta.className = 'ta';
        ta.id = 'ta' + i;
        document.getElementById(TBContainer[i]).appendChild(ta);
        const xbt = document.createElement('button');
        xbt.textContent = 'X';
        xbt.className = 'xbtn';
        xbt.onclick = () => {
            ta.remove();
            xbt.remove();
        };
        document.getElementById(TBContainer[i]).appendChild(xbt);
    };
});
const addbox = document.getElementById('acbb');
const removeBox = document.getElementById('removeCbb');
const boxContainer = document.getElementById('cb-body');
let boxCounter = 2;
function createCheckboxes(container, modValue, boxId) {
    container.innerHTML = '';
    const numCheckboxes = parseInt(modValue) || 1;
    for (let i = 0; i < numCheckboxes; i++) {
        let labelNum = i + 1;
        const cbwrapper = document.createElement('div');
        cbwrapper.className = 'cb-wrapper';
        cbwrapper.style.position = 'relative';
        cbwrapper.style.display = 'inline-block';
        cbwrapper.style.margin = '2px';
        container.appendChild(cbwrapper);
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id = `cb-${boxId}-${labelNum}`;
        cb.style.width = '24px';
        cb.style.height = '24px';
        cb.style.margin = '5px';
        cb.style.borderRadius = '3px';
        cb.style.border = '1px solid var(--accent)';
        cb.style.backgroundColor = 'var(--main-color)';
        cb.style.appearance = 'none';
        cbwrapper.appendChild(cb);
        const label = document.createElement('label');
        label.htmlFor = `cb-${boxId}-${labelNum}`;
        label.textContent = labelNum;
        label.style.position = 'absolute';
        label.style.right = '8px';
        label.style.top = '8px';
        label.style.pointerEvents = 'none';
        label.style.color = 'var(--text)';
        label.style.fontSize = '12px';
        cbwrapper.appendChild(label);
    }
}
if (addbox) {
    addbox.addEventListener('click', () => {
        const box = document.createElement('div');
        box.className = 'cb-grupe';
        boxContainer.appendChild(box);
        box.style.display = 'grid';
        box.style.gridTemplateColumns = '1fr 1fr';
        box.style.alignItems = 'center';
        box.style.margin = '5px';
        const text = document.createElement('input');
        text.type = 'text';
        text.id = `cb-name-${boxCounter}`;
        text.maxLength = 17;
        text.value = 'New Box';
        text.style.gridRow = '1';
        text.style.gridColumn = '1';
        text.style.margin = '5px';
        text.style.fontSize = 'x-large';
        text.style.width = '260px';
        text.style.border = '1px solid var(--accent)';
        text.style.borderRadius = '3px';
        text.style.backgroundColor = 'var(--main-color)';
        text.style.color = 'var(--text)';
        box.appendChild(text);
        const mod = document.createElement('input');
        mod.id = `modcb-${boxCounter}`;
        mod.value = '1';
        mod.maxLength = 2;
        mod.className = 'Modcb';
        mod.style.gridRow = '1';
        mod.style.gridColumn = '2';
        mod.style.margin = '5px';
        mod.style.width = '26px';
        mod.style.height = '28px';
        mod.style.textAlign = 'center';
        box.appendChild(mod);
        const cbCont = document.createElement('div');
        cbCont.className = 'cbcontainer';
        cbCont.id = `cb-container-${boxCounter}`;
        cbCont.style.gridRow = '2';
        cbCont.style.gridColumn = '1/3';
        cbCont.style.padding = '5px';
        box.appendChild(cbCont);
        const currentBoxId = boxCounter;
        const updateCheckboxes = () => {
            createCheckboxes(cbCont, mod.value, `box${currentBoxId}`);
        };
        mod.addEventListener('input', updateCheckboxes);
        updateCheckboxes();
        boxCounter++;
    });
}
if (removeBox) {
    removeBox.addEventListener('click', () => {
        const boxes = boxContainer.querySelectorAll('.cb-grupe');
        if (boxes.length > 2) {
            const lastBox = boxes[boxes.length - 1];
            lastBox.remove();
            boxCounter = Math.max(2, boxCounter - 1);
        }
    });
}
