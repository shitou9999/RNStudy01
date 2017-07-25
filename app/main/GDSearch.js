/**
 * Created by PVer on 2017/7/22.
 */
import React, {Component,PropTypes} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

//导航栏的外部文件
import CommunalNavBar from './GDCommunalNavBar';
//搜索界面
export default class GDSearch extends Component {

    //类 假设代表一个人  isRequired必要属性
    //1.属性声明
    //2.React.PropTypes.any 任意类型  array string boolean  func(方法) number object(对象)
    //3.属性是某个React元素  React.PropTypes.element
    //4.属性是某个特定的值React.PropTypes.oneOf(['value1'....'valuelN'])
    //5.属性为可渲染的节点 React.PropTypes.node
    //6.属性为指定类型中的一个
    // React.PropTypes.OneOfType({
    //    React.PropTypes.node,
    //    React.PropTypes.string,......
    // })
    //7.属性为某个指定类的实例 React.PropTypes.instanceOf(nameOfClass类的名字)
    //8.属性是一个指定构成方式的对象
    // React.PropTypes.shape({
    //  fontSize:React.PropTypes.number,
    //  color:React.PropTypes.string,.....
    // })
    //9.属性为指定类型的数组
    // React.PropTypes.array(React.PropTypes.string)
    //10.属性有一个指定的成员对象
    // React.PropTypes.objectOf(React.PropTypes.number)
    //属性默认值，外部没有传入，内部又需要使用，并且这个值有个通用的值的时候，就会调用默认值
    // static defaultProps ={
    //     name:'哈哈',
    // }

    static propTypes ={
        name:PropTypes.string,
        ID:PropTypes.number.isRequired,

    }

    //返回左边的按钮
    renderLeftItem(){
        return(
            <TouchableOpacity>
                <Image source={{uri:'hot_icon_20x20'}} style={styles.navbarLeftItemStyle}/>
            </TouchableOpacity>
        );
    }

    renderTitleItem(){
        return(
            <TouchableOpacity>
                <Image source={{uri:'navtitle_home_down_66x20'}} style={styles.navbarTitleItemStyle}/>
            </TouchableOpacity>
        );
    }
    //返回右边的按钮
    renderRightItem(){
        return(
            <TouchableOpacity>
                <Image source={{uri:'search_icon_20x20'}} style={styles.navbarRightItemStyle}/>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <CommunalNavBar
                    leftItem = {() => this.renderLeftItem()}
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
        backgroundColor: 'red',
    },
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle:{
        width:66,
        height:20,
    },
    navbarRightItemStyle:{
        width:20,
        height:20,
        marginRight:15,
    },

});
