/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

//引用外部文件
import Main from './app/main/GDMain';

export default class RNStudy extends Component {
  render() {
    return (

        <Main />

    );
  }
}

AppRegistry.registerComponent('RNStudy', () => RNStudy);
