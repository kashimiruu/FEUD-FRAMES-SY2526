const categorySelect = document.getElementById('category');
const subOptionSelect = document.getElementById('subOption');
const uploadInput = document.getElementById('upload');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

const options = {
    associate: {
        "GCU": "frames/associate-gcu.png",
        "Library": "frames/associate-lib.png"
    },
    faculty: {
        "CAB": "frames/faculty-cab.png",
        "GED": "frames/faculty-ged.png",
        "IT": "frames/faculty-it.png"
    },
    student: {
        "AGD": "frames/student-agd.png",
        "BSA": "frames/student-bsa.png",
        "CST": "frames/student-cst.png",
        "FM": "frames/student-fm.png",
        "MM": "frames/student-mm.png",
        "OM": "frames/student-om.png",
        "SE": "frames/student-se.png",
        "WMA": "frames/student-wma.png"
    }
};

let uploadedImage = null;
let frameImage = null;

// Update sub-options when category changes
categorySelect.addEventListener('change', () => {
    subOptionSelect.innerHTML = '<option value="">-- Select --</option>';
    const selectedCategory = categorySelect.value;
    if (options[selectedCategory]) {
        for (let label in options[selectedCategory]) {
            let opt = document.createElement('option');
            opt.value = options[selectedCategory][label];
            opt.textContent = label;
            subOptionSelect.appendChild(opt);
        }
    }
});

// Load frame when sub-option changes
subOptionSelect.addEventListener('change', () => {
    if (subOptionSelect.value) {
        frameImage = new Image();
        frameImage.src = subOptionSelect.value;
        frameImage.onload = drawPreview;
    }
});

// Handle image upload
uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        uploadedImage = new Image();
        uploadedImage.src = evt.target.result;
        uploadedImage.onload = drawPreview;
    };
    reader.readAsDataURL(file);
});

// Draw preview
function drawPreview() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (uploadedImage) {
        ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);
    }
    if (frameImage) {
        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    }
}

// Download image
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'dp_blast.png';
    link.href = canvas.toDataURL();
    link.click();
});
