import fs from "fs/promises";
import {Cartographic, Math as CesiumMath, Rectangle} from 'cesium';
import path from "path";

// A magic number to spread points across ~100 terrain tiles.
const DEFAULT_HALF_SIZE = 0.2;
const DEFAULT_NUMBER_OF_POINTS = 100;

// CLI args <JSON_FILE_PATH> <COORDINATE - latitude,longitude> <NUMBER_OF_POINTS - DEFAULT 100> <RECT_HALF_SIZE (Radians) - DEFAULT 0.2 for ~100 tiles range>
const [filePath, coordinate, numberOfPoints = DEFAULT_NUMBER_OF_POINTS, rectHalfSize = DEFAULT_HALF_SIZE] = process.argv.slice(2);

type Coordinate = Omit<Cartographic, "height">;

function generatePositions(coordinate: string, numberOfPoints: number, rectHalf?: number): {positions: Coordinate[]} {

    numberOfPoints = numberOfPoints < DEFAULT_NUMBER_OF_POINTS ? DEFAULT_NUMBER_OF_POINTS : numberOfPoints;
    
    const rectangleHalfSize = rectHalf ?? 0.2;

    const gridWidth = Math.floor(Math.sqrt(numberOfPoints));
    const gridHeight = Math.floor(Math.sqrt(numberOfPoints));

    const [reqLatitude, reqLongitude] = coordinate.split(',');

    const e = new Rectangle(
        +reqLongitude - rectangleHalfSize,
        +reqLatitude - rectangleHalfSize,
        +reqLongitude + rectangleHalfSize,
        +reqLatitude + rectangleHalfSize
    );
    const terrainSamplePositions: Coordinate[] = [];
    for (let y = 0; y < gridHeight; ++y) {
        for (let x = 0; x < gridWidth; ++x) {
            const longitude = CesiumMath.lerp(e.west, e.east, x / (gridWidth - 1));
            const latitude = CesiumMath.lerp(e.south, e.north, y / (gridHeight - 1));
            const position = new Cartographic(longitude, latitude);

            terrainSamplePositions.push({latitude: position.latitude, longitude: position.longitude } as Coordinate);
        }
    }
    return { positions: terrainSamplePositions };
}

const generatedPositions = generatePositions(coordinate, +(numberOfPoints), +(rectHalfSize));

void fs.writeFile(filePath, JSON.stringify(generatedPositions), {encoding: 'utf-8'});

console.log(`Positions created at \x1b[36m${path.resolve(filePath)}\x1b[0m`);
