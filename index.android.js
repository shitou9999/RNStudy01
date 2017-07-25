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
// import Main from './app/main/GDMain';
import LaunchPage from './app/main/GDLaunchPage';
import { Navigator } from 'react-native-deprecated-custom-components';


export default class RNStudy extends Component {
  render() {
    return (

        <Navigator
            initialRoute={{
                name:'LaunchPage',
                component:LaunchPage
            }}

            renderScene={(route,navigator) => {
                let Component = route.component;
                return <Component {...route.param} navigator={navigator}/>
            }}

        />

    );
  }
}

AppRegistry.registerComponent('RNStudy', () => RNStudy);
