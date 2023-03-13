import * as React from "react";
import { NVVoxelDataNode } from "./Data/nvoxel-data-node";
import { NVVoxelDataItem } from "Data/nvvoxel-data-item";
import {
  NVVoxelLoader,
  NVVoxelLoaderOptions,
} from "./ResourceLoader/nvvoxel-loader";
import { NVIMAGE_TYPE } from "./nifti/nifti-image-data";
import { NVColorTables } from "./Controller/nvcolor-tables";
interface IProps {
  hostId?: string;
}

interface IState {
  dataItem?: NVVoxelDataItem;
}

export class NiftiHeaderViewer extends React.Component<IProps, IState> {
  dataNode: NVVoxelDataNode | undefined;
  constructor(props: IProps) {
    super(props);

    const colorTables = new NVColorTables();
    console.log(colorTables);
  }

  async loadUrl() {
    const url = (document.getElementById("nifti-url-input") as HTMLInputElement)
      .value;
    console.log(`loading url ${url}`);
    const name = "test-image";
    const dataItem = await NVVoxelLoader.load(
      new NVVoxelLoaderOptions({ url, name, imageType: NVIMAGE_TYPE.NII })
    );
    this.setState({
      dataItem,
    });
  }

  public render() {
    if (!this.dataNode) {
      return (
        <div>
          <p>
            My host element is{" "}
            <span className="highlighted-span" id="host-id-span">
              {this.props.hostId}
            </span>
          </p>
          <div>
            <input id="nifti-url-input"></input>
            <button onClick={this.loadUrl}>Load</button>
          </div>
        </div>
      );
    }
    return (
      <div>
        <ul>
          <li>dim: {this.dataNode.hdr.dims}</li>
          <li>pixdim: {this.dataNode.hdr.pixDims}</li>
          <li>descrip: {this.dataNode.hdr.description}</li>
        </ul>
        <div>
          <input id="nifti-url-input"></input>
          <button onClick={this.loadUrl}>Load</button>
        </div>
      </div>
    );
  }
}
