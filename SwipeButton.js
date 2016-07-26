'use strict';

import React, {
  Component
} from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  PanResponder,
  Animated
} from 'react-native';

import Dimensions from 'Dimensions';

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;


export class SwipeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialX: 0,
      locationX: 0,
      dx: 0,
      movablePosition: new Animated.Value(0),
      buttonWidth: 0,
      released: false,
      swiped: true
    };
  }

  componentWillMount() {
    var self = this;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {},

      onPanResponderMove: (evt, gestureState) => {
        self.setState({
          locationX: evt.nativeEvent.locationX,
          dx: gestureState.dx
        });
      },

      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderRelease: (evt, gestureState) => {
        // Gesture succeeded
        if (this.state.dx > this.state.buttonWidth/2.5) {

          this.moveButtonAway(() => {
            self.setState({ swiped: true });

            if (this.props.onSwipeSuccess !== undefined) {
              this.props.onSwipeSuccess();
            }
          });

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

  measureButton() {
    var self = this;
    this.refs.button.measure((ox, oy, width, height) => {
      self.setState({
        initialX: ox,
        buttonWidth: width
      });
    });
  }

  moveButtonIn(onCompleteCallback) {
    this.setState({
      released: true,
      movablePosition: new Animated.Value(this.state.initialX - this.state.buttonWidth)
    });

    Animated.timing(
      this.state.movablePosition,
      {
        toValue: this.state.initialX
      }
    ).start(onCompleteCallback);
  }

  moveButtonAway(onCompleteCallback) {
    this.setState({
      released: true,
      movablePosition: new Animated.Value(this.state.initialX + this.state.dx)
    });

    Animated.timing(
      this.state.movablePosition,
      {
        toValue: this.state.buttonWidth * 2
      }
    ).start(onCompleteCallback);
  }

  snapToPosition(onCompleteCallback) {
    this.setState({
      released: true,
      movablePosition: new Animated.Value(this.state.initialX + this.state.dx)
    });

    Animated.timing(
      this.state.movablePosition,
      {
        toValue: this.state.initialX
      }
    ).start(onCompleteCallback);
  }

  onLayout(event) {
    this.setState({
      initialX: event.nativeEvent.layout.x,
      buttonWidth: event.nativeEvent.layout.width
    });
  }

  render() {
    if (this.state.released === true) {
      return (
          <View ref="button" style={{position: "relative"}} {...this.panResponder.panHandlers}>
            <Animated.View style={{position: 'absolute', left: this.state.movablePosition}}>
              <View>{this.props.children}</View>
            </Animated.View>
          </View>
      );
    } else {
      return (
          <View ref="button" style={{position: "relative"}} {...this.panResponder.panHandlers}>
            <View style={{position: 'absolute', left: this.state.dx}}>
              <View onLayout={this.onLayout.bind(this)}>{this.props.children}</View>
            </View>
          </View>
      );
    }
  }
}
