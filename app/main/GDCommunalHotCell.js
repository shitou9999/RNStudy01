/**
 * Created by PVer on 2017/7/22.
 */

import React, {Component,PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Platform,
    Image,
    Text,
} from 'react-native';

const {width,height} = Dimensions.get('window');
//近半小时热门item布局
export default class GDCommunalHotCell extends Component {

    static propTypes = {
        image:PropTypes.string,
        title:PropTypes.string,
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri:this.props.image === "" ? 'defaullt_thumb_83x83' : this.props.image}} style={styles.imageStyle} />
                <View>
                    <Text numberOfLines={3} style={styles.titleStyle}>{this.props.title}</Text>
                </View>
                <Image source={{uri:'icon_cell_rightArrow'}} style={styles.arrowStyle} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        //Platform ios和andorid 状态栏的不同 flexDirection主轴方向 justifyContent分布
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
        height:100,
        width:width,
        borderBottomWidth:0.5,
        borderBottomColor:'red',
        marginLeft:15,
    },
    imageStyle: {
        width:70,
        height:70,
    },
    titleStyle: {
        width:width * 0.65,
    },
    arrowStyle: {
        width:10,
        height:10,
        marginRight:30
    }

});
