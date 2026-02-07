/**
 * Devarajan Krishna Portfolio - Script
 * Handles Canvas Animation and Scroll Effects
 */

const canvas = document.getElementById('animation-canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('container');
const loader = document.getElementById('loader');

const sections = [
    { id: 'section-1', start: 0.05, end: 0.25 },
    { id: 'section-2', start: 0.30, end: 0.50 },
    { id: 'section-3', start: 0.55, end: 0.75 },
    { id: 'section-4', start: 0.82, end: 1.0, isFinal: true }
];

const totalFrames = 99;
const images = [];
let framesLoaded = 0;

// Path to images - Note: we point back to the public folder
// If running locally, this assumes the animation-frames folder is accessible
const imageDir = './animation-frames/';

function preloadImages() {
    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(3, '0');
        img.src = `${imageDir}ezgif-frame-${frameNumber}.jpg`;
        img.onload = () => {
            framesLoaded++;
            if (framesLoaded === totalFrames) {
                initApp();
            }
        };
        images.push(img);
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(calculateFrame(window.scrollY));
}

function calculateFrame(scrollTop) {
    const maxScroll = container.scrollHeight - window.innerHeight;
    const scrollFraction = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    const frameIndex = Math.min(
        Math.floor(scrollFraction * totalFrames),
        totalFrames - 1
    );
    return frameIndex;
}

function renderFrame(index) {
    const img = images[index];
    if (!img) return;

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

function updateSections(scrollTop) {
    const maxScroll = container.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    const fadeDuration = 0.1;

    sections.forEach(sec => {
        const el = document.getElementById(sec.id);
        if (!el) return;

        let opacity = 0;

        if (sec.isFinal) {
            if (progress > sec.start) {
                opacity = (progress - sec.start) / 0.15;
                el.style.pointerEvents = progress > 0.9 ? 'auto' : 'none';
            }
        } else {
            if (progress >= sec.start && progress <= sec.end) {
                if (progress < sec.start + fadeDuration) {
                    opacity = (progress - sec.start) / fadeDuration;
                } else if (progress > sec.end - fadeDuration) {
                    opacity = (sec.end - progress) / fadeDuration;
                } else {
                    opacity = 1;
                }
            }
        }

        opacity = Math.max(0, Math.min(1, opacity));
        el.style.opacity = opacity;

        // Transform effect
        const translateY = 20 - (opacity * 20);
        el.style.transform = `translateY(${translateY}px)`;
    });

    // Hide scroll prompt
    const scrollPrompt = document.getElementById('scroll-prompt');
    if (progress > 0.05) {
        scrollPrompt.style.opacity = '0';
    } else {
        scrollPrompt.style.opacity = Math.max(0, 0.7 - (progress * 14)).toString();
    }
}

function initApp() {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);

    window.addEventListener('scroll', () => {
        const frameIndex = calculateFrame(window.scrollY);
        requestAnimationFrame(() => {
            renderFrame(frameIndex);
            updateSections(window.scrollY);
        });
    });

    resizeCanvas();
    updateSections(0);
}

window.addEventListener('resize', resizeCanvas);

// Start
preloadImages();
