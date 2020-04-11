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

    let screenLetters = [];

    appCanvas.addEventListener("mousemove", (mousemove) => {
        function absMax(values, max) {
            return Math.max(Math.min(values, max), -max);
        }

        screenLetters.push({
                velocity: {
                    x: absMax(mousemove.movementX, 14),
                    y: absMax(mousemove.movementY, 14),
                },
                angularVelocity: absMax(mousemove.movementX, 0.06),
                position: {
                    x: mousemove.offsetX,
                    y: mousemove.offsetY,
                },
                angle: 0,
            }
        )
    });

    function tick(timeInfo) {
        const gravity = {
            x: 0,
            y: 50,
        }
        screenLetters.forEach(screenLetter => {
            screenLetter.velocity.x += gravity.x * timeInfo.delta;
            screenLetter.velocity.y += gravity.y * timeInfo.delta;
            screenLetter.position.x += screenLetter.velocity.x;
            screenLetter.position.y += screenLetter.velocity.y;
            screenLetter.angle += screenLetter.angularVelocity;
        })
        screenLetters = screenLetters.filter(screenLetter => screenLetter.position.y < appCanvas.height * 1.5);
    }


    function render() {
        context.clearRect(0, 0, appCanvas.width, appCanvas.height);

        screenLetters.forEach(screenLetter => {
            context.font = "2em sans-serif";
            context.save();
            context.translate(screenLetter.position.x, screenLetter.position.y);
            context.rotate(screenLetter.angle);
            const textMetrics = context.measureText('J');
            const glyphMetrics = {
                width: textMetrics.actualBoundingBoxLeft + textMetrics.actualBoundingBoxRight,
                height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent,
            }
            context.fillStyle = 'black';
            context.fillText("J", -glyphMetrics.width / 2, glyphMetrics.height / 2);
            context.restore();
        })
    }

    function startFrameLoop() {
        const initialTimeStamp = window.performance.now();
        let lastTimeStamp = initialTimeStamp;


        function animationFrame(currentTimeStamp) {
            requestAnimationFrame(animationFrame);
            const timeInfo = {
                time: (currentTimeStamp - initialTimeStamp) / 1000,
                delta: (currentTimeStamp - lastTimeStamp) / 1000,
            };
            tick(timeInfo);
            render();
            lastTimeStamp = currentTimeStamp;
        }

        animationFrame(initialTimeStamp);
    }

    startFrameLoop()
})();
