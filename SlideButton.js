'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  PanResponder,
  Animated
} from 'react-native';

export const SlideDirection = {
  LEFT: "left",
  RIGHT: "right",
  BOTH: "both"
};

export class SlideButton extends Component {
  constructor(props) {
    super(props);
    this.buttonWidth = 0;
    this.state = {
      initialX: 0,
      locationX: 0,
      dx: 0,
      animatedX: new Animated.Value(0),
      released: false,
      swiped: true,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {},

      onPanResponderMove: (evt, gestureState) => {
        this.setState({
          locationX: evt.nativeEvent.locationX,
          dx: gestureState.dx
        });
        this.onSlide(gestureState.dx);
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (this.isSlideSuccessful()) {
          // Move the button out
          this.moveButtonOut(() => {
            this.setState({ swiped: true });
            props.onSlideSuccess();
          });

          // Slide it back in after 0.5 sec
          setTimeout(() => {
            this.moveButtonIn(() => {
              this.setState({
                released: false,
                dx: this.state.initialX
              });
            });
          }, 500);

        } else {
          this.snapToPosition(() => {
            this.setState({
              released: false,
              dx: this.state.initialX
            });
          });
        }
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        this.snapToPosition(() => {
            this.setState({
              released: false,
              dx: this.state.initialX
            });
          });
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from
        // becoming the JS responder. Returns true by default. Is currently only
        // supported on android.
        return true;
      }
    });
  }

  /* Button movement of > 40% is considered a successful slide by default*/
  isSlideSuccessful = () => {
    const slidePercent = this.props.successfulSlidePercent || 40;
    const successfulSlideWidth = this.buttonWidth * slidePercent / 100;
    if (!this.props.slideDirection) {
      return this.state.dx > this.props.successfulSlideWidth;  // Defaults to right slide
    } else if (this.props.slideDirection === SlideDirection.RIGHT) {
      return this.state.dx > this.props.successfulSlideWidth;
    } else if (this.props.slideDirection === SlideDirection.LEFT) {
      return this.state.dx < (-1 * this.props.successfulSlideWidth);
    } else if (this.props.slideDirection === SlideDirection.BOTH) {
      return Math.abs(this.state.dx) > this.props.successfulSlideWidth;
    }
  }

  onSlide = x => {
    if (this.props.onSlide){
      this.props.onSlide(x);
    }
  }

  onSlideSuccess = () => {
    if (this.props.onSlideSuccess !== undefined) {
      this.props.onSlideSuccess();
    }
  }

  moveButtonIn = onCompleteCallback => {
    const startPos = this.state.dx < 0 ? this.state.initialX + this.buttonWidth :
        this.state.initialX - this.buttonWidth;
    const endPos = this.state.initialX;

    this.setState({
      released: true,
      animatedX: new Animated.Value(startPos)
    }, () => {
      Animated.timing(
        this.state.animatedX,
        { toValue: endPos }
      ).start(onCompleteCallback);
    });
  }

  moveButtonOut = onCompleteCallback => {
    const startPos = this.state.initialX + this.state.dx;
    const endPos = this.state.dx < 0 ? -this.buttonWidth : this.buttonWidth * 2;

    this.setState({
      released: true,
      animatedX: new Animated.Value(startPos)
    }, () => {
      Animated.timing(
        this.state.animatedX,
        { toValue: endPos }
      ).start(onCompleteCallback);
    });
  }

  snapToPosition = onCompleteCallback =>{
    const startPos = this.state.initialX + this.state.dx;
    const endPos = this.state.initialX;

    this.setState({
      released: true,
      animatedX: new Animated.Value(startPos)
    }, () => {
      Animated.timing(
        this.state.animatedX,
        { toValue: endPos }
      ).start(onCompleteCallback);
    });
  }

  onLayout = event => {
    this.buttonWidth = event.nativeEvent.layout.width;
    this.setState({
      initialX: event.nativeEvent.layout.x
    });
  }

  render() {
    return (
      <View style={{width: this.props.width, height: this.props.height, overflow:  'hidden'}}>
        <View style={styles.container} {...this.panResponder.panHandlers}>
          <InnerButton
            styles={this.props.styles}
            dx={this.state.dx}
            animatedX={this.state.animatedX}
            released={this.state.released}
            onLayoutChange={this.onLayout}
          >
            {this.props.children}
          </InnerButton>
        </View>
      </View>
    );
  }
}

SlideButton.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    successfulSlidePercent: React.PropTypes.number
};

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  button: {
    position: 'absolute'
  }
})

const InnerButton = ({
  styles,
  dx,
  animatedX,
  released,
  children,
  onLayoutChange
}) => {
  const style = [styles.button, stylez, {left: dx}];

  if (released) {
    style = [styles.button, stylez, {left: animatedX}];
    return (
      <Animated.View style={style}>
        {children}
      </Animated.View>
    );
  } else {
    return (
      <View style={style}>
        <View onLayout={onLayoutChange}>
         {children}
        </View>
      </View>
    );
  }
}