import type { PieSliceData } from "../PieSlice";
import type { PieSliceAngularInsetData } from "../PieSliceAngularInset";
type SliceAngularInsetPathArgs = {
    slice: PieSliceData;
    angularInset: PieSliceAngularInsetData;
};
export declare const useSliceAngularInsetPath: ({ angularInset, slice, }: SliceAngularInsetPathArgs) => readonly [import("react-native-skia").SkPath, import("react-native-skia").SkPaint];
export {};
