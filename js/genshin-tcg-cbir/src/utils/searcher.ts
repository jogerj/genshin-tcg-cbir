
export interface IndexData {
    name: string,
    data: Float32Array
}

export class Search {

    indexData: IndexData[];

    constructor(indexData: IndexData[]) {
        this.indexData = indexData;
    }

    search(queryFeatures: Float32Array, limit: number = 10) {
        let distances: [string, number][] = [];
        for (let entry of this.indexData) {
            let d = this.chi2_distance(entry.data, queryFeatures);
            distances.push([entry.name, d]);
        }
        let results = distances.sort(([, a], [, b]) => a - b);
        return results.slice(0, limit);
    }



    chi2_distance(histA: Float32Array, histB: Float32Array, eps = 1e-10) {
        return histA.map((a, i) => {
            let b = histB[i];
            return ((a - b) ** 2 / (a + b + eps))
        }).reduce((a, b) => a + b, 0);
    }

}