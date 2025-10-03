import './style.css'
import { diagramData } from 'virtual:diagram-data'
import { diagramImages } from 'virtual:diagram-images'

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function parseImageName(filename) {
    const nameWithoutExt = filename.replace('.jpg', '');
    const parts = nameWithoutExt.split('_');

    if (parts.length >= 3) {
        const pageNumber = parts[0];
        const index = parts[parts.length - 1];

        return {
            pageNumber,
            index,
            displayName: `Page ${pageNumber} [#${index}]`
        };
    }

    return {
        pageNumber: '',
        index: '',
        displayName: filename
    };
}

function renderDiagrams(key, images) {
    const diagramsGrid = document.getElementById('diagrams-grid');

    images.forEach(imageName => {
        const imageInfo = parseImageName(imageName);
        const imagePath = `https://github.com/ReallyLiri/elements-facsimile/raw/main/docs/diagrams/${key}/crops/${imageName}`;

        const diagramCard = document.createElement('div');
        diagramCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer';

        diagramCard.innerHTML = `
            <div class="aspect-w-16 aspect-h-12 bg-gray-200">
                <img src="${imagePath}" alt="${imageInfo.displayName}" class="w-full h-48 object-cover">
            </div>
            <div class="p-4">
                <h3 class="text-lg font-medium text-gray-900 mb-1">${imageInfo.displayName}</h3>
                <div class="text-sm text-gray-600">
                    <p>Page: ${imageInfo.pageNumber}</p>
                    <p>Index: ${imageInfo.index}</p>
                </div>
            </div>
        `;

        diagramCard.addEventListener('click', () => {
            openImageModal(imagePath, imageInfo.displayName);
        });

        diagramsGrid.appendChild(diagramCard);
    });
}

function openImageModal(imagePath, title) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');

    modalImage.src = imagePath;
    modalImage.alt = title;
    modalTitle.textContent = title;

    modal.classList.remove('hidden');
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
}

function initializePage() {
    const key = getUrlParameter('key');

    if (!key || !diagramData[key]) {
        document.getElementById('document-title').textContent = 'Document Not Found';
        document.getElementById('document-description').textContent = 'The requested document could not be found.';
        return;
    }

    const documentInfo = diagramData[key];
    document.getElementById('document-title').textContent = documentInfo.title;
    document.getElementById('document-description').textContent = documentInfo.description;

    const images = diagramImages[key] || [];

    if (images.length === 0) {
        const diagramsGrid = document.getElementById('diagrams-grid');
        diagramsGrid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No diagrams found for this document.</div>';
        return;
    }

    renderDiagrams(key, images);
}

document.addEventListener('DOMContentLoaded', () => {
    initializePage();

    document.getElementById('close-modal').addEventListener('click', closeImageModal);
    document.getElementById('image-modal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeImageModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
});