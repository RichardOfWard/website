(() => {
    const appCanvas = document.querySelector('canvas.app-canvas');
    const context = appCanvas.getContext('2d');

    function initializeCanvasSizing() {
        const appCanvasContainer = document.querySelector('.app-canvas-container');

        function resizeCanvas() {
            appCanvas.width = Math.max(100, appCanvasContainer.offsetWidth);
            appCanvas.height = Math.max(100, appCanvasContainer.offsetHeight);
        }

        // resize on page load
        resizeCanvas();

        // resize canvas to same size as parent whenever it changes
        window.addEventListener("resize", resizeCanvas);

        // resize periodically to cope with flash of mis-styled content
        setInterval(resizeCanvas, 1000);
    }

    initializeCanvasSizing();

    function render({time, delta}) {
        context.clearRect(0, 0, appCanvas.width, appCanvas.height);
        context.save();

        context.arc(0, 0, 5, 0, 2 * Math.PI);
        context.fillStyle = 'blue';
        context.fill();
        // Non-rotated rectangle
        context.fillStyle = 'gray';
        context.fillRect(100, 0, 80, 20);

        // Rotated rectangle
        context.rotate(time * 0.01 * Math.PI / 180);
        context.fillStyle = 'red';
        context.fillRect(100, 0, 80, 20);

        // Reset transformation matrix to the identity matrix
        context.restore();
    }

    function startFrameLoop() {
        const initialTimeStamp = window.performance.now();
        let lastTimeStamp = initialTimeStamp;


        function animationFrame(currentTimeStamp) {
            requestAnimationFrame(animationFrame);
            const time = currentTimeStamp - initialTimeStamp;
            const delta = currentTimeStamp - lastTimeStamp;
            render(Object.freeze({time, delta}));
            lastTimeStamp = currentTimeStamp;
        }

        animationFrame(initialTimeStamp);
    }

    startFrameLoop()

})();
