// Run with "npm run index"

import glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import cv from 'opencv-ts';
import { ColorDescriptor } from './colordescriptor';

const { getSync } = require('@andreekeberg/imagedata')

async function onRuntimeInitialized() {
    console.log('OpenCV Ready')

    const charactersPath = "../../images/characters/";
    const actionsPath = "../../images/actions/";
    const characters: string[] = glob.sync('*.png', { cwd: charactersPath });
    const actions: string[] = glob.sync('*.png', { cwd: actionsPath });


    console.log(`Found ${characters.length} character cards in ${charactersPath}`)
    console.log(`Found ${actions.length} action cards in ${actionsPath}`)

    // Generate features
    const cd = new ColorDescriptor([8, 12, 3])

    let charactersIndex: { name: string, data: Float32Array }[] = [];
    for (let characterFile of characters) {
        let imageId = characterFile.substring(0, characterFile.length - 4);
        let imageFile = fs.readFileSync(path.join(charactersPath, characterFile));
        let imageData = getSync(imageFile) as ImageData;
        let imageMat = cv.matFromImageData(imageData);
        let features = cd.describeImage(imageMat);
        imageMat.delete();
        charactersIndex.push({ name: imageId, data: features });
    }

    let actionsIndex: { name: string, data: Float32Array }[] = [];
    for (let actionFile of actions) {
        let imageId = actionFile.substring(0, actionFile.length - 4);
        let imageFile = fs.readFileSync(path.join(actionsPath, actionFile));
        let imageData = getSync(imageFile);
        let imageMat = cv.matFromImageData(imageData);
        let features = cd.describeImage(imageMat);
        imageMat.delete();
        actionsIndex.push({ name: imageId, data: features });
    }

    // Save results
    let charactersIndexJson = JSON.stringify(charactersIndex, 
        (k, v) => ArrayBuffer.isView(v) ? Array.from(v as unknown as ArrayLike<unknown>) : v, 2);
    fs.writeFileSync("public/characters_index.json", charactersIndexJson);
    let actionsIndexJson = JSON.stringify(actionsIndex, 
        (k, v) => ArrayBuffer.isView(v) ? Array.from(v as unknown as ArrayLike<unknown>) : v, 2);
    fs.writeFileSync("public/actions_index.json", actionsIndexJson);

    console.log(`Generated features for ${charactersIndex.length} character cards.`)
    console.log(`Generated features for ${actionsIndex.length} action cards.`)
}

cv.onRuntimeInitialized = onRuntimeInitialized;

export { };