import type { PointsArray } from "../../types";
import type { CurveType } from "../utils/curves";
export type AreaPathOptions = {
    curveType?: CurveType;
    connectMissingData?: boolean;
};
export declare const useAreaPath: (points: PointsArray, y0: number, { curveType, connectMissingData }?: AreaPathOptions) => {
    path: import("react-native-skia").SkPath;
};
