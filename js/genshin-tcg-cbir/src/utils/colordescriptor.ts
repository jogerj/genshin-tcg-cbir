import cv, { Mat } from "opencv-ts";


export class ColorDescriptor {

    bins: number[];

    constructor(bins: number[]) {
        this.bins = bins
    }

    describeImage(image: Mat) {
        let dst = new cv.Mat();
        cv.cvtColor(image, dst, cv.COLOR_BGR2HSV);
        let [h, w] = [dst.size().height, dst.size().width];
        

        let center = new cv.Point(Math.floor(w * 0.5), Math.floor(h * 0.5));
        let axes = new cv.Size(Math.floor(Math.floor(w * 0.75) / 2), Math.floor(Math.floor(h * 0.75) / 2));
        let ellipMask = new cv.Mat.zeros(h, w, cv.CV_8U);
        cv.ellipse(ellipMask, center, axes, 0, 0, 360, new cv.Scalar(255), -1);
        let hist = this.histogram(dst, ellipMask);
        
        dst.delete();
        ellipMask.delete();

        return hist;
       
    }

    histogram(image: Mat, mask: Mat){
        let imageVec = new cv.MatVector();
        imageVec.push_back(image);
        let hist = new cv.Mat();
        cv.calcHist(imageVec, [0,1,2], mask, hist, this.bins,  [0, 180, 0, 256, 0, 256]);
        let normHist = new cv.Mat();
        cv.normalize(hist, normHist, 0, 255, cv.NORM_MINMAX);
        hist.delete();
        imageVec.delete();
        return normHist.data32F;
    }

}