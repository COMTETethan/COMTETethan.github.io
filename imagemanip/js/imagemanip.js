document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const formatOptions = document.querySelectorAll('.format-option');
    const convertBtn = document.getElementById('convertBtn');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const previewImageContainer = document.getElementById('previewImageContainer');
    const previewImage = document.getElementById('previewImage');
    const previewActions = document.getElementById('previewActions');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const originalSizeEl = document.getElementById('originalSize');
    const newSizeEl = document.getElementById('newSize');
    const compressionRatioEl = document.getElementById('compressionRatio');
    
    let selectedFile = null;
    let selectedFormat = 'webp';
    let convertedImageData = null;
    let originalSize = 0;
    let convertedSize = 0;
    
    init();
    
    function init() {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', handleFileSelect);
        
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        
        formatOptions.forEach(option => {
            option.addEventListener('click', function() {
                formatOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                selectedFormat = this.getAttribute('data-format');
            });
        });
        
        convertBtn.addEventListener('click', convertImage);
        
        downloadBtn.addEventListener('click', downloadImage);
        
        resetBtn.addEventListener('click', resetConverter);
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }
    
    function processFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showError('Veuillez sélectionner un fichier image valide (JPG, JPEG ou PNG)');
            return;
        }
                
        selectedFile = file;
        originalSize = file.size;
        
        originalSizeEl.textContent = `Original: ${formatFileSize(originalSize)}`;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewPlaceholder.style.display = 'none';
            previewImageContainer.style.display = 'flex';
            
            convertBtn.disabled = false;
        };
        reader.readAsDataURL(file);
        
        uploadArea.classList.add('file-selected');
    }
    
    async function convertImage() {
        if (!selectedFile) return;
        
        showLoading();
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = await loadImage(selectedFile);
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const mimeType = selectedFormat === 'webp' ? 'image/webp' : 'image/avif';
            let quality = selectedFormat === 'webp' ? 0.8 : 0.5; // Lower quality for AVIF

            const blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, quality));
            convertedImageData = URL.createObjectURL(blob);
            convertedSize = blob.size;

            newSizeEl.textContent = `Convertit: ${formatFileSize(convertedSize)}`;
            const ratio = Math.round((1 - (convertedSize / originalSize)) * 100);
            compressionRatioEl.textContent = `Compression: ${ratio}%`;
            
            previewImage.src = convertedImageData;
            previewActions.style.display = 'flex';
            
            showSuccess();
        } catch (error) {
            console.error('Conversion error:', error);
            if (error.message.includes('AVIF')) {
                console.warn('AVIF non supporté, passage en WebP');
                selectedFormat = 'webp';
                await convertImage();
            } else {
                showError('Erreur de conversion. Veuillez réessayer.');
            }
        } finally {
            hideLoading();
        }
    }

    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    function downloadImage() {
        if (!convertedImageData) return;
        
        const link = document.createElement('a');
        link.href = convertedImageData;
        link.download = `${selectedFile.name.split('.')[0]}.${selectedFormat}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(convertedImageData); // Clean up
        
        downloadBtn.classList.add('btn-success');
        setTimeout(() => downloadBtn.classList.remove('btn-success'), 1000);
    }

    function resetConverter() {
        if (convertedImageData) URL.revokeObjectURL(convertedImageData);
        fileInput.value = '';
        selectedFile = null;
        convertedImageData = null;
        
        previewPlaceholder.style.display = 'flex';
        previewImageContainer.style.display = 'none';
        previewActions.style.display = 'none';
        
        originalSizeEl.textContent = 'Original: -- KB';
        newSizeEl.textContent = 'Converted: -- KB';
        compressionRatioEl.textContent = 'Compression: --%';
        
        convertBtn.disabled = true;
        
        uploadArea.classList.remove('file-selected');
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / 1048576).toFixed(1) + ' MB';
        }
    }
    
    function showLoading() {
        let loadingOverlay = document.querySelector('.loading-overlay');
        
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.classList.add('loading-overlay');
            
            const spinner = document.createElement('div');
            spinner.classList.add('loading-spinner');
            
            loadingOverlay.appendChild(spinner);
            document.body.appendChild(loadingOverlay);
        }
        
        setTimeout(() => {
            loadingOverlay.classList.add('active');
        }, 0);
    }
    
    function hideLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }
    
    function showError(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast-notification', 'toast-error');
        
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-exclamation-circle');
        
        const text = document.createElement('span');
        text.textContent = message;
        
        toast.appendChild(icon);
        toast.appendChild(text);
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 0);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    function showSuccess() {
        const toast = document.createElement('div');
        toast.classList.add('toast-notification', 'toast-success');
        
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-check-circle');
        
        const text = document.createElement('span');
        text.textContent = 'Image convertie avec succès !';
        
        toast.appendChild(icon);
        toast.appendChild(text);
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 0);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        .toast-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 10000;
        }
        
        .toast-notification.show {
            transform: translateX(0);
        }
        
        .toast-error {
            background-color: rgba(255, 0, 0, 0.9);
            border-left: 5px solid #ff0000;
        }
        
        .toast-success {
            background-color: rgba(0, 255, 0, 0.9);
            border-left: 5px solid #00ff00;
        }
        
        .toast-notification i {
            font-size: 1.5rem;
        }
        
        .btn-success {
            background: linear-gradient(90deg, var(--tertiary-neon), var(--primary-neon)) !important;
            box-shadow: 0 0 25px rgba(0, 255, 0, 0.5) !important;
        }
    `;
    document.head.appendChild(style);
});
