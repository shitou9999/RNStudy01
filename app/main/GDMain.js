/**
 * Created by PVer on 2017/7/21.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    DeviceEventEmitter,
    AsyncStorage,
} from 'react-native';
//第三方框架  Navigator跳转路由
import { Navigator } from 'react-native-deprecated-custom-components';
import TabNavigator from 'react-native-tab-navigator';
//引入外部文件
import Home from '../home/GDHome';
import HT from '../ht/GDHt';
import HourList from '../hourList/GDHourList';
//引入
import HTTP from '../http/HTTPBase';


export default class GDMain extends Component {

    // ES6
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            selectedTab:'home',
            isHiddenTabBar:false, // 是否隐藏tabbar
            cnbadgeText:'',         // 首页Item角标文本
            usbadgeText:''          // 海淘Item角标文本
        };

    }

    // 返回TabBar的Item
    renderTabBarItem(title, selectedTab, image, selectedImage, component,badgeText) {
        return(
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                badgeText={badgeText == 0 ? '' : badgeText}
                selectedTitleStyle={{color:'black'}}
                renderIcon={() => <Image source={{uri:image}} style={styles.tabbarIconStyle} />}
                renderSelectedIcon={() => <Image source={{uri:selectedImage}} style={styles.tabbarIconStyle} />}
                onPress={() => this.setState({ selectedTab: selectedTab })}>

                <Navigator
                    // 设置路由
                    initialRoute={{
                        name:selectedTab,
                        component:component,
                    }}

                    // 设置跳转动画
                    configureScene={(route) => this.setNavAnimationType(route)}

                    renderScene={(route, navigator) => {
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} />
                    }}
                />
            </TabNavigator.Item>
        );
    }

    //设置Navigator跳转动画
    setNavAnimationType(route){
        if (route.animationType){ //有值 不去掉手势！return route.animationType;
            let conf = route.animationType;
            conf.gestures = null;
            return conf;
        }else{
            return Navigator.SceneConfigs.PushFromRight; //默认动画
        }
    }

    //隐藏tabbar的通知
    componentDidMount(){
        this.subscription = DeviceEventEmitter.addListener('isHiddenTabBar',(data) =>{this.tongZhi(data)});
        let cnfirstID = 0;
        let usfirstID = 0;

        setInterval(() =>{
            //取出id
            AsyncStorage.getItem('cnfirstID')
                .then((value) =>{
                    cnfirstID = parseInt(value);
                });
            AsyncStorage.getItem('usfirstID')
                .then((value) =>{
                    usfirstID = parseInt(value);
                });

            // if (cnfirstID !== 0 && usfirstID !==0)
            //拼接参数
            let params = {
                "cnmaxid" :cnfirstID,
                "usmaxid" : usfirstID
            }
            // 请求数据
            HTTPBase.get('http://guangdiu.com/api/getnewitemcount.php', params)
                .then((responseData) => {
                    this.setState({
                        cnbadgeText:responseData.cn,
                        usbadgeText:responseData.us
                    })
                })
                .catch((error) => {

                })
        },1500);
    }

    tongZhi(data){
        this.setState({
            isHiddenTabBar:data
        })
    }
    //注销通知
    componentWillUnmount(){
        this.subscription.remove()
    }

    render() {
        return (
            <TabNavigator
                tabBarStyle={this.state.isHiddenTabBar !== true ? {} : {height:0,overflow:'hidden'}}
                sceneStyle={this.state.isHiddenTabBar !== true ? {} : {paddingBottom:0}}
            >
                {/* 首页 */}
                {this.renderTabBarItem("首页1", 'home', 'tabbar_home_30x30', 'tabbar_home_selected_30x30', Home,this.state.cnbadgeText)}
                {/* 海淘 */}
                {this.renderTabBarItem("海淘2", 'ht', 'tabbar_abroad_30x30', 'tabbar_abroad_selected_30x30', HT,this.state.usbadgeText)}
                {/* 小时风云榜 */}
                {this.renderTabBarItem("小时风云榜", 'hourlist', 'tabbar_rank_30x30', 'tabbar_rank_selected_30x30', HourList)}
            </TabNavigator>
        );
    }

// <TabNavigator
// tabBarStyle={{ height: tabBarHeight, overflow: 'hidden' }}
// sceneStyle={{ paddingBottom: tabBarHeight }}
// />

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff34f5',
    },
    tabbarIconStyle: {
        width:Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25,
    }
});

// renderIcon: PropTypes.func,
//     renderSelectedIcon: PropTypes.func,
//     badgeText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     renderBadge: PropTypes.func,
//     title: PropTypes.string,
//     titleStyle: Text.propTypes.style,
//     selectedTitleStyle: Text.propTypes.style,
//     tabStyle: View.propTypes.style,
//     selected: PropTypes.bool,
//     onPress: PropTypes.func,
//     allowFontScaling: PropTypes.bool,
{/*<TabNavigator.Item*/}
    {/*selected={this.state.selectedTab === 'home'}*/}
    {/*title="Home"*/}
    {/*renderIcon={() => <Image source={...} />}*/}
    {/*renderSelectedIcon={() => <Image source={...} />}*/}
    {/*badgeText="1"*/}
    {/*onPress={() => this.setState({ selectedTab: 'home' })}>*/}
    {/*{homeView}*/}
{/*</TabNavigator.Item>*/}