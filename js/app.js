document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. Audio Control Logic
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const memoryVideo = document.getElementById('memory-video');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerText = "🔇 Play Music";
        } else {
            bgMusic.play();
            musicBtn.innerText = "🎵 Pause Music";
        }
        isPlaying = !isPlaying;
    });

    // Auto pause background music if video is played
    if(memoryVideo) {
        memoryVideo.addEventListener('play', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicBtn.innerText = "🔇 Play Music";
                isPlaying = false;
            }
        });
    }

    // 3. Three.js Background (Ethereal Golden Particles)
    const canvas = document.querySelector('#webgl-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700; 
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15, color: 0xE5C07B, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let mouseX = 0; let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    const clock = new THREE.Clock();
    const animateThree = () => {
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;
        particlesMesh.position.x += (mouseX * 5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY * 5 - particlesMesh.position.y) * 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(animateThree);
    };
    animateThree();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 4. Anime.js Scroll Reveals
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    duration: 1500,
                    easing: 'easeOutExpo'
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const revealElements = document.querySelectorAll('.reveal-text, .reveal-card');
    revealElements.forEach(el => {
        el.style.opacity = '0'; 
        observer.observe(el);
    });

    // 5. Interactive Rakhi Button Animation
    const rakhiBtn = document.getElementById('rakhi-btn');
    const rakhiMessage = document.getElementById('rakhi-message');

    rakhiBtn.addEventListener('click', () => {
        anime({
            targets: rakhiBtn,
            scale: [1, 0.8], opacity: [1, 0], duration: 800, easing: 'easeInQuad',
            complete: () => {
                rakhiBtn.style.display = 'none';
                rakhiMessage.style.display = 'block';
                anime({ targets: rakhiMessage, translateY: [20, 0], opacity: [0, 1], duration: 1200, easing: 'easeOutExpo' });
                anime({ targets: particlesMaterial, size: 0.5, opacity: 1, duration: 1000, direction: 'alternate', easing: 'easeInOutSine' });
            }
        });
    });
});
