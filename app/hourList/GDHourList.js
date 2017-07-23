/**
 * Created by PVer on 2017/7/21.
 * import TabNavigator from 'react-native-tab-navigator';
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';

import CommunalNavBar from '../main/GDCommunalNavBar';

export default class GDHourList extends Component {

    renderTitleItem(){
        return(
            <TouchableOpacity>
                <Image source={{uri:'navtitle_rank_107x20'}} style={styles.navBarTitleItemStyle} />
            </TouchableOpacity>
        );
    }
    // 返回右边按钮
    renderRightItem() {
        return(
            <TouchableOpacity
                // onPress={()=>{this.pushToSettings()}}
            >
                <Text style={styles.navBarRightItemStyle}>设置</Text>
            </TouchableOpacity>
        );
    }


    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <CommunalNavBar
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'green',
    },
    navBarTitleItemStyle:{
        width:107,
        height:20,
        marginLeft:50,
    },
    navBarRightItemStyle: {
        fontSize:17,
        color:'rgba(123,178,114,1.0)',
        marginRight:15,
    },

});
