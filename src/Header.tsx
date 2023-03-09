import * as React from "react";

interface IProps {
  name?: string;
}

// https://stackoverflow.com/questions/53885993/react-16-7-react-sfc-is-now-deprecated
const Header: React.FunctionComponent<IProps> = (props: IProps) => (
  <h1>Hello, {props.name}! Welcome to React and TypeScript.</h1>
);

Header.defaultProps = {
  name: "world",
};

export default Header;
