export interface IPolylinePrimitiveArgs {
    lineWidth: number
    bgColor: number | null
    strokeColor: number | null
    points: PolylinePrimitivePoint[]
    ignoreZoom: boolean
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
