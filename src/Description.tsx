import * as React from "react";

interface IProps {
  countBy?: number;
}

interface IState {
  count: number;
}

class Description extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    countBy: 1,
  };

  public state: IState = {
    count: 0,
  };

  public increase = () => {
    if (!this.props.countBy) {
      throw new Error("count by null");
    }
    const countBy: number = this.props.countBy;
    const count = this.state.count + countBy;
    this.setState({ count });
  };

  public render() {
    return (
      <div>
        <p>
          My favorite number is <span id="counter">{this.state.count}</span>
        </p>
        <button onClick={this.increase}>Increase</button>
      </div>
    );
  }
}

export default Description;
