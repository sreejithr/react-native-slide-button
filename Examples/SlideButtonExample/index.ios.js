/**
 * Slide Button Example App
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { SlideButton } from 'react-native-slide-button';

var Dimensions = require('Dimensions');
var SCREEN_WIDTH = Dimensions.get('window').width;

class SlideButtonExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swiped: false
    };
  }

  onSlide() {
    this.setState({swiped: !this.state.swiped});
  }

  render() {
    var message = (
        <Text style={{paddingBottom: 20, color: '#0FACF3'}}>
          Please Slide Button
        </Text>
    );

    if (this.state.swiped) {
      message = (
          <Text style={{paddingBottom: 20, color: 'green'}}>
            Slide Success!
          </Text>
      );
    }

    return (
      <View style={styles.container}>
        <View>
          {message}
        </View>

        <View style={styles.buttonOuter}>
          <SlideButton onSwipeSuccess={this.onSlide.bind(this)}>
            <View style={styles.buttonInner}>
              <Text style={styles.button}>Slide Button</Text>
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
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  buttonOuter: {
    backgroundColor: '#0FACF3',
    height: 50,
    width: SCREEN_WIDTH-40
  },
  buttonInner: {
    width: SCREEN_WIDTH-40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    color: 'white',
    fontWeight: 'bold'
  }
});

AppRegistry.registerComponent('SlideButtonExample', () => SlideButtonExample);
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

class SlideButtonExample extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('SlideButtonExample', () => SlideButtonExample);
