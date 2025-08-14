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
        const imgRatio = uploadedImage.width / uploadedImage.height;
        const canvasRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgRatio > canvasRatio) {
            // Image is wider → fill height, crop sides
            drawHeight = canvas.height;
            drawWidth = imgRatio * drawHeight;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Image is taller → fill width, crop top/bottom
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(uploadedImage, offsetX, offsetY, drawWidth, drawHeight);
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

// Disable initially
downloadBtn.disabled = true;

// Disables the button when a category or suboption change
categorySelect.addEventListener('change', () => {
    downloadBtn.disabled = !subOptionSelect.value; 
});
subOptionSelect.addEventListener('change', () => {
    downloadBtn.disabled = !subOptionSelect.value; 
});

document.addEventListener("DOMContentLoaded", () => {
    const loadingCover = document.getElementById("loadingCover");
    const rotateCover = document.getElementById("rotateCover");

    // Function to check orientation
    function checkOrientation() {
        if (window.innerHeight > window.innerWidth) {
            rotateCover.style.display = "flex";
        } else {
            rotateCover.style.display = "none";
        }
    }

    // Check orientation on load and resize
    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    // Wait until all images and frames are loaded
    const images = Array.from(document.images); // all <img> tags (if any)
    const frames = []; // your frame images can be added here if preloading

    const allImages = [...images, ...frames];

    if (allImages.length === 0) {
        // No images to wait for, hide loading immediately
        loadingCover.style.display = "none";
    } else {
        let loadedCount = 0;
        allImages.forEach((img) => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener("load", () => {
                    loadedCount++;
                    if (loadedCount === allImages.length) {
                        loadingCover.style.display = "none";
                    }
                });
            }
        });
        // If all images were already complete
        if (loadedCount === allImages.length) {
            loadingCover.style.display = "none";
        }
    }
});

console.log("uploaded correctly.");
