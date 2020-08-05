import * as Constants from "../Constants";
import { Entity } from "./Entity";
import {
    intersectTwoRects,
    randomInt,
    getAssetInfo,
    getBounds
} from "../Core/Utils";

export class Skier extends Entity {
    assetName = Constants.SKIER_DOWN;

    direction = Constants.SKIER_DIRECTIONS.DOWN;
    speed = Constants.SKIER_STARTING_SPEED;

    constructor(x, y) {
        super(x, y);
    }

    setDirection(direction) {
        this.direction = direction;
        this.updateAsset();
    }

    updateAsset() {
        this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
    }

    move() {
        switch (this.direction) {
            case Constants.SKIER_DIRECTIONS.LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case Constants.SKIER_DIRECTIONS.DOWN:
                this.moveSkierDown();
                break;
            case Constants.SKIER_DIRECTIONS.RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
        }
    }

    moveSkierJump() {
        if (!this.assetName.startsWith(Constants.SKIER_JUMP_BASE)) {
            let randResult = randomInt(0, 4)
            this.assetToRestore = this.assetName
            switch (randResult) {
                case 0: this.assetName = Constants.SKIER_JUMP_0;
                    break;
                case 1: this.assetName = Constants.SKIER_JUMP_1;
                    break;
                case 2: this.assetName = Constants.SKIER_JUMP_2;
                    break;
                case 3: this.assetName = Constants.SKIER_JUMP_3;
                    break;
                case 4: this.assetName = Constants.SKIER_JUMP_4;
                    break;
            }
            setTimeout(() => { this.assetName = this.assetToRestore }, 500);
        }
    }

    moveSkierLeft() {
        this.x -= Constants.SKIER_STARTING_SPEED;
    }

    moveSkierLeftDown() {
        this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierDown() {
        this.y += this.speed;
    }

    moveSkierRightDown() {
        this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierRight() {
        this.x += Constants.SKIER_STARTING_SPEED;
    }

    moveSkierUp() {
        this.y -= Constants.SKIER_STARTING_SPEED;
    }

    turnLeft() {
        if (this.direction === Constants.SKIER_DIRECTIONS.LEFT) {
            this.moveSkierLeft();
        }
        else {
            this.direction =
                this.direction === Constants.SKIER_DIRECTIONS.CRASH ?
                    Constants.SKIER_DIRECTIONS.LEFT :
                    this.direction - 1;
            this.setDirection(this.direction);
        }
    }

    turnRight() {
        if (this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierRight();
        }
        else {
            this.setDirection(this.direction + 1);
        }
    }

    turnUp() {
        if (this.direction === Constants.SKIER_DIRECTIONS.LEFT || this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierUp();
        }
    }

    turnDown() {
        this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
    }

    jump() {
        if (this.direction === Constants.SKIER_DIRECTIONS.LEFT_DOWN ||
            this.direction === Constants.SKIER_DIRECTIONS.RIGHT_DOWN ||
            this.direction === Constants.SKIER_DIRECTIONS.DOWN) {
            this.moveSkierJump();
        }
    }

    checkIfSkierHitRamp(obstacleManager, assetManager) {
        const skierBounds = getBounds(assetManager.getAsset(this.assetName), this);
        const collision = obstacleManager.getObstacles().find((obstacle) => {
            return intersectTwoRects(skierBounds, getAssetInfo(assetManager, obstacle)) &&
                obstacle.getAssetName() === Constants.RAMP;
        })

        if (collision && !this.assetName.startsWith(Constants.SKIER_JUMP_BASE)) {
            this.jump();
        }
    }

    checkIfSkierHitObstacle(obstacleManager, assetManager) {
        const skierBounds = getBounds(assetManager.getAsset(this.assetName), this)

        const collision = obstacleManager.getObstacles().find((obstacle) => {
            if ((this.assetName.startsWith(Constants.SKIER_JUMP_BASE) &&
                (obstacle.getAssetName() === Constants.ROCK1 ||
                    obstacle.getAssetName() === Constants.ROCK2)) ||
                obstacle.getAssetName() === Constants.RAMP) {
                return false;
            }
            return intersectTwoRects(skierBounds, getAssetInfo(assetManager, obstacle));
        });

        if (collision) {
            this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
        }
    };
}