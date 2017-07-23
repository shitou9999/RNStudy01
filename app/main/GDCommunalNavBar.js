/**
 * Created by PVer on 2017/7/22.
 */

import React, {Component,PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Platform,
} from 'react-native';

// var Dimensions =require('Dimensions');
// import Dimensions =require('Dimensions');
const {width,height} = Dimensions.get('window');

export default class GDCommunalNavBar extends Component {

    //es6 static 管理  这里只是初始化，没有值，可以有值！
    static propTypes = {
      leftItem:PropTypes.func,
      titleItem:PropTypes.func,
      rightItem:PropTypes.func,
    };

    // 左边  注意this.props.leftItem()有括号
    renderLeftItem() {
        if (this.props.leftItem === undefined) return;
        return this.props.leftItem();
    }

    // 中间
    renderTitleItem() {
        if (this.props.titleItem === undefined) return;
        return this.props.titleItem();
    }

    // 右边
    renderRightItem() {
        if (this.props.rightItem === undefined) return;
        return this.props.rightItem();
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 传入属性，是否创建View,根据是否有值没有值不创建*/}
                {/*左边*/}
                <View>
                    {this.renderLeftItem()}
                </View>
                {/*中间*/}
                <View>
                    {this.renderTitleItem()}
                </View>
                {/*右边*/}
                <View>
                    {this.renderRightItem()}
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //Platform ios和andorid 状态栏的不同 flexDirection主轴方向 justifyContent分布
        width:width,
        height:Platform.OS === 'ios' ? 64 : 44,
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:0.5,
        borderBottomColor:'gray',
        paddingTop:Platform.OS == 'ios' ? 15: 0,
    },





});
