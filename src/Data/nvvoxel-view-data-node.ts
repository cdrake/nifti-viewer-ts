import { NVVoxelDataNode } from "./nvoxel-data-node";
import { NVVoxelDataItem } from "./nvvoxel-data-item";

export class NVVoxelViewDataNode extends NVVoxelDataNode {
    private _clipPlaneDepthAziElev: [number, number, number] = [2, 0, 0];
    private _scale: number = 1.0;
    private _baseVolumeDims: [number, number, number];
    overlayNodes: NVVoxelViewDataNode[] = [];

    constructor(data: NVVoxelDataItem) {
        super(data);
        this._baseVolumeDims = data.hdr.dims.slice(0, 3);
    }

    get clipPlaneDepthAziElev() {
        return this._clipPlaneDepthAziElev;
    }
    set clipPlaneDepthAziElev(value) {
        this._clipPlaneDepthAziElev = value;
        if (this.onPropertyChange) {
            this.onPropertyChange(this.id, "clipPlaneDepthAziElev");
        }
    }

    get scale() {
        return this._scale;
    }
    set scale(value) {
        this._scale = value;
        if (this.onPropertyChange) {
            this.onPropertyChange(this.id, "scale");
        }
    }

    get baseVolumeDims() {
        return this._baseVolumeDims;
    }
    set baseVolumeDims(value) {
        this._baseVolumeDims = value;
    }
}