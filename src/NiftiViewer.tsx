import * as React from "react";
import { NVVoxelLoaderOptions } from "./ResourceLoader/nvvoxel-loader";

interface IProps {
  hostId?: string;
}

class NiftiViewer extends React.Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    hostId: "gl",
  };

  public render() {
    const url = "https://localhost:8080/url";
    const name = "test-image";
    const urlLoaderOptions = new NVVoxelLoaderOptions({ url, name });

    return (
      <div>
        <p>
          My host element is{" "}
          <span className="highlighted-span" id="host-id-span">
            {this.props.hostId}
          </span>
        </p>
        <p>
          My targeted URL is{" "}
          <span className="highlighted-span" id="url-span">
            {urlLoaderOptions.url}
          </span>
        </p>
      </div>
    );
  }
}

export default NiftiViewer;
