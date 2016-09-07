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

var Dimensions = require('Dimensions');
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;


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

  componentWillMount() {
    var self = this;

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
      },

      onPanResponderRelease: (evt, gestureState) => {
        // Button movement of > 40% is considered a successful slide
        if (this.state.dx > (this.buttonWidth * 0.4)) {
          // Move the button out
          this.moveButtonOut(() => {
            self.setState({ swiped: true });
            self.onSlideSuccess();
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
    var self = this;
    var startPos = this.state.initialX - this.buttonWidth;
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
    var endPos = this.buttonWidth * 2;

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
    var button = (
        <View style={style}>
          <View onLayout={this.onLayout.bind(this)}>
            {this.props.children}
          </View>
        </View>
    );

    if (this.state.released) {
      style = [styles.button, this.props.style, { left: this.state.animatedX }];
      button = (
          <Animated.View style={style}>
            {this.props.children}
          </Animated.View>
      );
    }

    return (
        <View ref="button" style={styles.container} 
         {...this.panResponder.panHandlers}>
          { button }
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  button: {
    position: 'absolute'
  }
})
