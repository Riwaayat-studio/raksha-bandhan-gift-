document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. Audio Control & Smart Auto-Play Logic
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const memoryVideo = document.getElementById('memory-video');
    let isPlaying = false;
    let userInteracted = false;

    // ✨ NAYA: Smart Auto-Play on First Scroll or Tap
    const startMusic = () => {
        if (!userInteracted) {
            bgMusic.volume = 1.0;
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.innerText = "🎵 Pause Music"; // Button update ho jayega
            }).catch(err => console.log("Waiting for user interaction to play music."));
            userInteracted = true;
            
            // Ek baar play hone ke baad in listeners ko hata do
            window.removeEventListener('scroll', startMusic);
            document.removeEventListener('click', startMusic);
            document.removeEventListener('touchstart', startMusic);
        }
    };

    // User jaise hi scroll ya tap karega, music start ho jayega
    window.addEventListener('scroll', startMusic, { once: true });
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });

    // Manual Toggle Button (Taki koi mute karna chahe toh kar sake)
    musicBtn.addEventListener('click', () => {
        userInteracted = true; 
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerText = "🔇 Play Music";
        } else {
            bgMusic.play();
            musicBtn.innerText = "🎵 Pause Music";
        }
        isPlaying = !isPlaying;
    });

    // ✨ NAYA: Smart Video Audio Ducking (Volume Low/High)
    if (memoryVideo) {
        // Jab Video Play ho -> Background Music Volume Low (15%)
        memoryVideo.addEventListener('play', () => {
            if (isPlaying) {
                anime({
                    targets: bgMusic,
                    volume: 0.15,
                    duration: 1000,
                    easing: 'linear'
                });
            }
        });

        // Jab Video Pause ho ya khtam ho -> Music Volume Normal (100%)
        memoryVideo.addEventListener('pause', () => {
            if (isPlaying) {
                anime({
                    targets: bgMusic,
                    volume: 1.0,
                    duration: 1000,
                    easing: 'linear'
                });
            }
        });

        // ✨ NAYA: Scroll Detector for Video
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Agar video screen se bahar chali jaye aur play ho rahi ho, toh video ko pause kar do
                if (!entry.isIntersecting && !memoryVideo.paused) {
                    memoryVideo.pause(); // Pause hote hi upar wala event music volume wapas 100% kar dega!
                }
            });
        }, { threshold: 0.1 }); 

        videoObserver.observe(memoryVideo);
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

    // 5. Interactive 3D Rakhi Drop Animation
    const rakhiBtn = document.getElementById('rakhi-btn');
    const rakhiMessage = document.getElementById('rakhi-message');
    const real3DRakhi = document.getElementById('real-3d-rakhi');

    if (rakhiBtn && real3DRakhi) {
        rakhiBtn.addEventListener('click', () => {
            // Button ko fade out kardo
            anime({
                targets: rakhiBtn,
                scale: [1, 0.8], 
                opacity: [1, 0], 
                duration: 800, 
                easing: 'easeInQuad',
                complete: () => {
                    rakhiBtn.style.display = 'none';
                    
                    // 3D Rakhi ko upar se drop karwao!
                    anime({
                        targets: real3DRakhi,
                        opacity: [0, 1],
                        translateY: [-150, 0], 
                        scale: [0.5, 1.2], 
                        duration: 1800,
                        easing: 'easeOutElastic(1, 0.5)', 
                        complete: () => {
                            rakhiMessage.style.display = 'block';
                            anime({ 
                                targets: rakhiMessage, 
                                translateY: [20, 0], 
                                opacity: [0, 1], 
                                duration: 1200, 
                                easing: 'easeOutExpo' 
                            });

                            anime({ 
                                targets: particlesMaterial, 
                                size: 0.6, 
                                opacity: 1, 
                                duration: 1000, 
                                direction: 'alternate', 
                                easing: 'easeInOutSine' 
                            });
                            
                            real3DRakhi.style.pointerEvents = 'auto';
                        }
                    });
                }
            });
        });
    }
});
