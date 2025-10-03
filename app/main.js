import './style.css'
import { pdfData } from 'virtual:pdf-data'

let filteredData = [...pdfData];

function createPdfItem(pdf) {
    const pdfItem = document.createElement('div');
    pdfItem.className = 'flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors';

    pdfItem.innerHTML = `
        <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
                <img src="https://elements-resource-box.netlify.app/tps/${pdf.key}_tp.png"
                     alt="${pdf.key} thumbnail"
                     class="max-h-48 w-auto object-contain">
            </div>
            <div>
                <h3 class="text-lg font-medium text-gray-900">${pdf.key}</h3>
                ${pdf.hasDigrams ? '<p class="text-sm text-green-600">Has diagrams available</p>' : '<p class="text-sm text-gray-500">PDF only</p>'}
            </div>
        </div>
        <div class="flex gap-2">
            ${pdf.hasDigrams ? `
                <a href="diagrams.html?key=${pdf.key}" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                    View Diagrams
                </a>
            ` : ''}
            <a href="https://github.com/ReallyLiri/elements-facsimile/raw/main/docs/${pdf.key}.pdf" target="_blank" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Download PDF
            </a>
        </div>
    `;

    return pdfItem;
}

function renderPdfList() {
    const pdfListContainer = document.getElementById('pdf-list');
    const noResultsContainer = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');

    pdfListContainer.innerHTML = '';

    if (filteredData.length === 0) {
        pdfListContainer.classList.add('hidden');
        noResultsContainer.classList.remove('hidden');
        resultsCount.textContent = 'No documents found';
    } else {
        pdfListContainer.classList.remove('hidden');
        noResultsContainer.classList.add('hidden');

        filteredData.forEach(pdf => {
            const pdfItem = createPdfItem(pdf);
            pdfListContainer.appendChild(pdfItem);
        });

        const total = pdfData.length;
        const showing = filteredData.length;
        resultsCount.textContent = showing === total
            ? `Showing all ${total} documents`
            : `Showing ${showing} of ${total} documents`;
    }
}

function filterData() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterValue = document.getElementById('filter-select').value;

    filteredData = pdfData.filter(pdf => {
        const matchesSearch = pdf.key.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'all' ||
                            (filterValue === 'diagrams' && pdf.hasDigrams);

        return matchesSearch && matchesFilter;
    });

    renderPdfList();
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-select');

    searchInput.addEventListener('input', filterData);
    filterSelect.addEventListener('change', filterData);
}

function initializePage() {
    filteredData = [...pdfData];
    renderPdfList();
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', initializePage);