class Tutorial extends Stage {
    constructor() {
        super();
        this.bg = 255;
    }

    show() {
        background(this.bg);

        // image()

        if (gameMode === 0 && video) {
            // Use forced video size for reliability
            let videoW = video.width;
            let videoH = video.height;
            // Scale to fit window while preserving aspect ratio
            let scale = min(windowWidth / videoW, windowHeight / videoH);
            let vidW = videoW * scale;
            let vidH = videoH * scale;
            // TRUE centering
            let vidX = (windowWidth - vidW) * 0.5;
            let vidY = (windowHeight - vidH) * 0.5;
            // Draw video
            // image(video, vidX, vidY, vidW, vidH);
            // Overlay FaceMesh keypoints mapped to the video area
            if (faces.length > 0) {
                let kp = faces[0].keypoints;
                noStroke();
                fill(100);
                for (let i = 0; i < kp.length; i++) {
                    // For mirrored webcam, use: let mappedX = vidX + ((videoW - kp[i].x) / videoW) * vidW;
                    let mappedX = vidX + ((videoW - kp[i].x) / videoW) * vidW;
                    let mappedY = vidY + (kp[i].y / videoH) * vidH;
                    ellipse(mappedX, mappedY, 4, 4);
                }
            }
        }
        if (gameMode === 1) {
            console.log('Keyboard tutorial is activated.');
        }
    }
}