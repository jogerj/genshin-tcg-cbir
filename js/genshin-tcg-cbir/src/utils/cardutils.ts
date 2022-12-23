import cv, { Mat } from "opencv-ts";
import { ColorDescriptor } from "./colordescriptor";
import { Search } from "./searcher";

import Dims from "./dimensions.json";


function searchCard(image: Mat, cd: ColorDescriptor, search: Search) {
    let features = cd.describeImage(image);
    let results = search.search(features, 10);
    return results[0][0];
}

function cropCard(image: Mat, x: number, y: number, w: number, h: number) {
    let rect = new cv.Rect(x, y, w, h);
    let dst = new cv.Mat();
    dst = image.roi(rect);
    return dst;
}

export function parseCards(queryImage: Mat, charSearcher: Search, actionsSearcher: Search) {
    let h = queryImage.size().height;
    let w = queryImage.size().width;
    if ( h !== 1630) {
        throw new RangeError(`Image height must be exactly 1630px! Input image height was ${h} px.`)
    }
    if (w !== 1200) {
        throw new RangeError(`Image width must be exactly 1200px! Input image height was ${w} px.`)
    }
    let cd = new ColorDescriptor([8, 12, 3])

    let characters: { [id: string]: number } = {};
    let actions: { [id: string]: number } = {};

    for (let charPos of Dims.characters.pos) {
        let cardImage = cropCard(queryImage, charPos[0], charPos[1], Dims.characters.w, Dims.characters.h);
        let cardId = searchCard(cardImage, cd, charSearcher);
        characters[cardId] = 1;
    }
    console.log('characters', characters);
    for (let actPos of Dims.actions.pos) {
        let cardImage = cropCard(queryImage, actPos[0], actPos[1], Dims.actions.w, Dims.actions.h);

        let cardId = searchCard(cardImage, cd, actionsSearcher);
        if (cardId in actions)
            actions[cardId] += 1;
        else
            actions[cardId] = 1;
    }
    console.log('actions', actions);

    return [characters, actions];
}