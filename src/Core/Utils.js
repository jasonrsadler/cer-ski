export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function intersectTwoRects(rect1, rect2) {
    return !(rect2.left > rect1.right ||
        rect2.right < rect1.left ||
        rect2.top > rect1.bottom ||
        rect2.bottom < rect1.top);
}

export function getAssetInfo(assetManager, obstacle) {
    const obstacleAsset = assetManager.getAsset(obstacle.getAssetName());
    const obstaclePosition = obstacle.getPosition();
    return new Rect(
        obstaclePosition.x - obstacleAsset.width / 2,
        obstaclePosition.y - obstacleAsset.height / 2,
        obstaclePosition.x + obstacleAsset.width / 2,
        obstaclePosition.y);
}

export function getBounds(asset, skier) {
    return new Rect(
        skier.x - asset.width / 2,
        skier.y - asset.height / 2,
        skier.x + asset.width / 2,
        skier.y - asset.height / 4
    );
}

export class Rect {
    left = 0;
    top = 0;
    right = 0;
    bottom = 0;

    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
}