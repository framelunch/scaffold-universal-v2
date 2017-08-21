// @flow
import anime from 'animejs';
import React from 'react';
import { state, getTargetRoute, isMatch } from './RoutePublisher';

type RouteProps = {
  target: string,
  component: any,
};

class Route extends React.Component<void, RouteProps, void> {
  container: HTMLElement & { style: any };
  isShow: boolean;
  isAnimation: boolean;
  onChange: () => void;
  onAdd: () => void;
  onRemove: () => void;

  constructor(props: RouteProps) {
    super(props);
    this.isShow = isMatch(this.props.target);
    this.isAnimation = this.isShow;
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }
  componentDidMount() {
    const { target } = this.props;
    state.listen(`add:${target}`, this.onAdd);
    state.listen(`remove:${target}`, this.onRemove);
  }
  componentWillUnmount() {
    const { target } = this.props;
    state.clear(`add:${target}`, this.onAdd);
    state.clear(`remove:${target}`, this.onRemove);
  }

  onAdd() {
    if (this.isAnimation) return;

    this.isAnimation = true;
    this.container.style.opacity = 0;
    this.container.style.transform = 'translateY(10px)';
    this.container.style.display = '';

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
      this.container.style.display = 'none';
      this.isAnimation = false;
      this.isShow = false;
      this.forceUpdate();

      state.notify();
    });
  }

  render() {
    if (!this.isShow) {
      this.isShow = isMatch(this.props.target);
      if (!this.isShow) return null;
    }

    const display = this.isAnimation ? null : 'none';
    const { target } = this.props;
    const { match } = getTargetRoute();

    return (
      <div ref={elm => { this.container = elm; }} style={{ display }}>
        {React.createElement(this.props.component, { target, match })}
      </div>
    );
  }
}

export default Route;
