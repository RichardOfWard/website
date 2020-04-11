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

    const texts = [
        "To-morrow, and to-morrow, and to-morrow, Creeps in this petty pace from day to day, To the last syllable of recorded time; And all our yesterdays have lighted fools The way to dusty death. Out, out, brief candle! Life is but a walking shadow, a poor player That struts and frets his hour upon the stage And then is heard no more. It is a tale Told by an idiot, full of sound and fury Signifying nothing.",
        " Out, damn'd spot! out, I say!—One; two: why, then 'tis time to do't.—Hell is murky. —Fie, my lord, fie, a soldier, and afeard? What need we fear who knows it, when none can call our pow'r to accompt? —Yet who would have thought the old man to have had so much blood in him?",
        "O serpent heart hid with a flowering face! Did ever a dragon keep so fair a cave? Beautiful tyrant, feind angelical, dove feather raven, wolvish-ravening lamb! Despised substance of devinest show, just opposite to what thou justly seemest - A dammed saint, an honourable villain!",
        "Villain, what hast thou done? That which thou canst not undo. Thou hast undone our mother. Villain, I have done thy mother.",
    ]
    let textNumber = 0, characterNumber = 0;
    let lastLetterAdded = window.performance.now() / 1000;

    appCanvas.addEventListener("mousemove", (mousemove) => {
        const now = window.performance.now() / 1000;
        if (now - lastLetterAdded < 0.09) {
            return;
        }
        lastLetterAdded = now;

        function absMax(values, max) {
            return Math.max(Math.min(values, max), -max);
        }

        const character = texts[textNumber][characterNumber];
        characterNumber += 1;
        if (characterNumber >= texts[textNumber].length) {
            characterNumber = 0;
            textNumber += 1;
        }
        if (textNumber >= texts.length) {
            textNumber = 0;
        }

        screenLetters.push({
            character: character,
            velocity: {
                x: absMax(mousemove.movementX, 14),
                y: absMax(mousemove.movementY, 14),
            },
            angularVelocity: absMax(mousemove.movementX / 100, 0.06),
            position: {
                x: mousemove.offsetX,
                y: mousemove.offsetY,
            },
            angle: 0,
        });
    });

    function tick(timeInfo) {
        const gravity = {
            x: 0,
            y: 10,
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
            const textMetrics = context.measureText(screenLetter.character);
            const glyphMetrics = {
                width: textMetrics.actualBoundingBoxLeft + textMetrics.actualBoundingBoxRight,
                height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent,
            }
            context.fillStyle = 'black';
            context.fillText(screenLetter.character, -glyphMetrics.width / 2, glyphMetrics.height / 2);
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
