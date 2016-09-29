/**
 * Slide Button Example Component
 **/

'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import { SlideButton, SlideDirection } from 'react-native-slide-button';

var Dimensions = require('Dimensions');
var SCREEN_WIDTH = Dimensions.get('window').width;

const NORMAL_COLOR = '#0FACF3';
const SUCCESS_COLOR = '#39ca74';

export default class SlideButtonExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swiped: false,
      leftSwiped: false,
      rightSwiped: false,
    };
  }

  onLeftSlide() {
    var self = this;
    this.setState({swiped: true, leftSwiped: true}, () => {
      setTimeout(() => self.setState({swiped: false, leftSwiped: false}), 2500);
    });
  }

  onRightSlide() {
    var self = this;
    this.setState({swiped: true, rightSwiped: true}, () => {
      setTimeout(() => self.setState({swiped: false, rightSwiped: false}), 2500);
    });
  }

  onBothSlide() {
    var self = this;
    this.setState({swiped: true, bothSwiped: true}, () => {
      setTimeout(() => self.setState({swiped: false, bothSwiped: false}), 2500);
    });
  }

  render() {
    var message = this.state.swiped ? "Slide Successful!" : "Slide Any Button";
    var messageColor = this.state.swiped ? SUCCESS_COLOR : NORMAL_COLOR;
    var leftButtonColor = this.state.leftSwiped ? SUCCESS_COLOR : NORMAL_COLOR;
    var rightButtonColor = this.state.rightSwiped ? SUCCESS_COLOR : NORMAL_COLOR;
    var bothButtonColor = this.state.bothSwiped ? SUCCESS_COLOR : NORMAL_COLOR;

    return (
      <View style={styles.container}>
        <View>
          <Text style={{color: messageColor}}>
            {message}
          </Text>
        </View>

        <View style={{marginTop: 20, backgroundColor: rightButtonColor}}>
          <SlideButton
           onSlideSuccess={this.onRightSlide.bind(this)}
           width={SCREEN_WIDTH-40}
           height={50}>
            <View style={styles.buttonInner}>
              <Text style={styles.button}>Slide Right</Text>
            </View>
          </SlideButton>
        </View>

        <View style={{marginTop: 20, backgroundColor: leftButtonColor}}>
          <SlideButton
           onSlideSuccess={this.onLeftSlide.bind(this)}
           slideDirection={SlideDirection.LEFT}
           width={SCREEN_WIDTH-40}
           height={50}>
            <View style={styles.buttonInner}>
              <Text style={styles.button}>Slide Left</Text>
            </View>
          </SlideButton>
        </View>

        <View style={{marginTop: 20, backgroundColor: bothButtonColor}}>
          <SlideButton
           onSlideSuccess={this.onBothSlide.bind(this)}
           slideDirection={SlideDirection.BOTH}
           width={SCREEN_WIDTH-40}
           height={50}>
            <View style={styles.buttonInner}>
              <Text style={styles.button}>Slide Any Direction</Text>
            </View>
          </SlideButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonOuter: {
    marginTop: 20
  },
  buttonInner: {
    width: SCREEN_WIDTH-40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  }
});
