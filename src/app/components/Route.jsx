// @flow
import anime from 'animejs';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { state, getTargetRoute } from './RoutePublisher';

type RouteProps = {
  route: string,
  component: any,
};
type RouteState = {
  isHide: boolean
};

class Route extends React.Component<void, RouteProps, RouteState> {
  state: RouteState;
  container: HTMLElement & { style: any };
  onAdd: () => void;
  onRemove: ()=> void;

  constructor(props) {
    super(props);
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);

    const { route } = this.props;
    const { target } = getTargetRoute() || {};
    this.state = { isHide: target.indexOf(route) === -1 };
  }
  componentDidMount() {
    const { route } = this.props;
    state.listen(`add:${route}`, this.onAdd);
    state.listen(`remove:${route}`, this.onRemove);
  }
  componentWillUnmount() {
    const { route } = this.props;
    state.clear(`add:${route}`, this.onAdd);
    state.clear(`remove:${route}`, this.onRemove);
  }

  onAdd() {
    if (!this.state.isHide) return;

    this.setState({ isHide: false });
    this.container.style.opacity = 0;
    this.container.style.transform = 'translateY(10px)';

    state.wait();
    anime({
      targets: this.container,
      opacity: 1,
      translateY: 0,
      duration: 200,
      easing: 'easeOutQuad',
    }).finished.then(() => state.notify());
  }
  onRemove() {
    state.wait();

    anime({
      targets: this.container,
      opacity: 0,
      translateY: 10,
      duration: 200,
      easing: 'easeOutQuad',
    }).finished.then(() => {
      this.setState({ isHide: true });
      state.notify();
    });
  }

  render() {
    if (this.state.isHide) return null;

    return (
      <div ref={elm => (this.container = elm)}>
        { React.createElement(this.props.component, { route: this.props.route }) }
      </div>
    );
  }
}

export default withRouter(Route);
