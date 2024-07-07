document.getElementById('addRow').addEventListener('click', () => {
    const tierList = document.getElementById('tierList');
    const newRow = document.createElement('div');
    newRow.className = 'tier-row';
    newRow.style.backgroundColor = 'lightgray';
    newRow.innerHTML = `
        <span contenteditable="plaintext-only">New Tier</span>
        <div class="items" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
        <button class="change-color" onclick="openColorPicker(this)">Change Color</button>
        <button class="delete-row">Delete Row</button>
    `;
    tierList.appendChild(newRow);
});

document.getElementById('tierList').addEventListener('click', (event) => {

if (event.target.classList.contains('delete-row')) {
        const row = event.target.closest('.tier-row');
        row.remove();
    }
});

document.getElementById('imageInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            const img = document.createElement('img');
            img.src = reader.result;
            img.draggable = true;
            img.addEventListener('dragstart', drag);
            img.dataset.id = file.name;
            document.getElementById('imagePool').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData('text', event.target.src);
    event.dataTransfer.setData('id', event.target.dataset.id);
    event.target.classList.add('dragging');
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const id = event.dataTransfer.getData('id');

    const target = event.target;

    // Check if the target is the contenteditable span
    if (target.getAttribute('contenteditable') === 'true') {
        return; // Prevent dropping into the contenteditable span
    }
    
    const targetRow = event.target.closest('.tier-row .items');
    const pool = document.getElementById('imagePool');
    const trashCan = document.getElementById('trashCan');

    if (targetRow) {
   
        const existingImage = document.querySelector(`.tier-row .items img[data-id="${id}"]`);
        if (!existingImage) {

            const poolImage = document.querySelector(`#imagePool img[data-id="${id}"]`);
            if (poolImage) {
                poolImage.remove();
            }

            const img = document.createElement('img');
            img.src = data;
            img.draggable = true;
            img.addEventListener('dragstart', drag);
            img.dataset.id = id;
            targetRow.appendChild(img);
        } else {
           
            existingImage.remove();
            targetRow.appendChild(existingImage);
        }
    } else if (event.target.id === 'imagePool') {
      
        const draggingImage = document.querySelector(`img.dragging`);
        if (draggingImage) {
            draggingImage.classList.remove('dragging');
            draggingImage.remove();
            pool.appendChild(draggingImage);
        }
    } else if (event.target.id === 'trashCan') {
      
        const draggingImage = document.querySelector(`img.dragging`);
        if (draggingImage) {
            draggingImage.remove();
        }
    } else {
    
        const draggingImage = document.querySelector(`img.dragging`);
        if (draggingImage && event.target.closest('.tier-row .items')) {
            draggingImage.classList.remove('dragging');
            draggingImage.remove();
            event.target.closest('.tier-row .items').appendChild(draggingImage);
        }
    }
}

document.addEventListener('dragend', (event) => {
    event.target.classList.remove('dragging');
});

function openColorPicker(button) {
    const row = button.closest('.tier-row');
    const colorPicker = document.createElement('input');
    colorPicker.setAttribute('type', 'color');
    colorPicker.value = row.style.backgroundColor;
    colorPicker.addEventListener('change', function() {
        row.style.backgroundColor = this.value;
    });
    colorPicker.click();
}