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

export var SlideDirection = {
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
  }

  /* Button movement of > 40% is considered a successful slide by default*/
  isSlideSuccessful() {
    var slidePercent = this.props.successfulSlidePercent || 40;
    var successfulSlideWidth = this.buttonWidth * slidePercent / 100;
    if (!this.props.slideDirection) {
      return this.state.dx > successfulSlideWidth;  // Defaults to right slide
    } else if (this.props.slideDirection === SlideDirection.RIGHT) {
      return this.state.dx > successfulSlideWidth;
    } else if (this.props.slideDirection === SlideDirection.LEFT) {
      return this.state.dx < (-1 * successfulSlideWidth);
    } else if (this.props.slideDirection === SlideDirection.BOTH) {
      return Math.abs(this.state.dx) > successfulSlideWidth;
    }
  }

  onSlide(x) {
    if (this.props.onSlide){
      this.props.onSlide(x);
    }
  }

  componentWillMount() {
    var self = this;

    // TODO: Raise error if slideDirection prop is invalid.

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {},

      onPanResponderMove: (evt, gestureState) => {
        self.setState({
          locationX: evt.nativeEvent.locationX,
          dx: gestureState.dx
        });
        self.onSlide(gestureState.dx);
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (this.isSlideSuccessful()) {
          // Move the button out
          this.moveButtonOut(() => {
            self.setState({ swiped: true });
            self.props.onSlideSuccess();
          });

          // Slide it back in after 1 sec
          setTimeout(() => {
            self.moveButtonIn(() => {
              self.setState({
                released: false,
                dx: self.state.initialX
              });
            });
          }, 1000);

        } else {
          this.snapToPosition(() => {
            self.setState({
              released: false,
              dx: self.state.initialX
            });
          });
        }
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        this.snapToPosition(() => {
            self.setState({
              released: false,
              dx: self.state.initialX
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

  onSlideSuccess() {
    if (this.props.onSlideSuccess !== undefined) {
      this.props.onSlideSuccess();
    }
  }

  moveButtonIn(onCompleteCallback) {
    var self = this;
    var startPos = this.state.dx < 0 ? this.state.initialX + this.buttonWidth :
        this.state.initialX - this.buttonWidth;
    var endPos = this.state.initialX;

    this.setState({
      released: true,
      animatedX: new Animated.Value(startPos)
    }, () => {
      Animated.timing(
        self.state.animatedX,
        { toValue: endPos }
      ).start(onCompleteCallback);
    });
  }

  moveButtonOut(onCompleteCallback) {
    var self = this;
    var startPos = this.state.initialX + this.state.dx;
    var endPos = this.state.dx < 0 ? -this.buttonWidth : this.buttonWidth * 2;

    this.setState({
      released: true,
      animatedX: new Animated.Value(startPos)
    }, () => {
      Animated.timing(
        self.state.animatedX,
        { toValue: endPos }
      ).start(onCompleteCallback);
    });
  }

  snapToPosition(onCompleteCallback) {
    var self = this;
    var startPos = this.state.initialX + this.state.dx;
    var endPos = this.state.initialX;

    this.setState({
      released: true,
      animatedX: new Animated.Value(startPos)
    }, () => {
      Animated.timing(
        self.state.animatedX,
        { toValue: endPos }
      ).start(onCompleteCallback);
    });
  }

  onLayout(event) {
    this.buttonWidth = event.nativeEvent.layout.width;
    this.setState({
      initialX: event.nativeEvent.layout.x
    });
  }

  render() {
    var style = [styles.button, this.props.style, {left: this.state.dx}];

    if (this.state.released) {
      style = [styles.button, this.props.style, {left: this.state.animatedX}];
      var button = (
        <Animated.View style={style}>
          {this.props.children}
        </Animated.View>
      );
    } else {
      var button = (
        <View style={style}>
          <View onLayout={this.onLayout.bind(this)}>
           {this.props.children}
          </View>
        </View>
      );
    }

    return (
      <View style={{width: this.props.width, height: this.props.height, overflow:  'hidden'}}>
        <View style={styles.container} {...this.panResponder.panHandlers}>
          { button }
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
