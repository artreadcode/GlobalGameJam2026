class Tutorial extends Stage {
    constructor() {
        super();
        this.bg = 255;
    }

    show() {
        background(this.bg);

        if (gameMode === 0 && video) {
            for (let i = 0; i < faces.length; i++) {
                let face = faces[i];
                for (let j = 0; j < face.keypoints.length; j++) {
                    let keypoint = face.keypoints[j];
                    fill(0, 255, 0);
                    noStroke();
                    circle(keypoint.x, keypoint.y, 5);
                }
            }
        }
    }
}