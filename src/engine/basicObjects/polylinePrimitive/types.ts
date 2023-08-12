export interface IPolylinePrimitiveArgs {
    lineWidth: number
    bgColor: number | null
    bgOpacity: number
    strokeColor: number | null
    strokeOpacity: number
    points: PolylinePrimitivePoint[]
    ignoreZoom: boolean
    ignoreSmallPointOptimization: boolean
}

export type PolylinePrimitiveBeizerPoint = {
    x: number
    y: number
    cp1x: number
    cp1y: number
    cp2x: number
    cp2y: number
}

export type PolylinePrimitiveRegularPoint = {
    x: number
    y: number
    cp1x: null
    cp1y: null
    cp2x: null
    cp2y: null
}

export type PolylinePrimitivePoint = PolylinePrimitiveBeizerPoint | PolylinePrimitiveRegularPoint;
