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
    ListView,
    Dimensions,
    ActivityIndicator,
} from 'react-native';

const {width,height} = Dimensions.get("window");
import { Navigator } from 'react-native-deprecated-custom-components';
import {PullList} from 'react-native-pull';
//当前文件夹下 一个.
import CommunalNavBar from '../main/GDCommunalNavBar';
import HalfHourHot from './GDHalfHourHot';
import Search from './GDSearch';
import NoDataView from '../main/GDNoDataView';
import CommunalHotCell from '../main/GDCommunalHotCell';

//主界面
export default class GDHome extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}),
            loaded:false,
        };
        // 绑定
        this.fetchData = this.fetchData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    //返回左边的按钮
    renderLeftItem(){
        return(
            <TouchableOpacity
                onPress={() => {this.pushToHalfHourHot()}}
                >
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
            <TouchableOpacity
                onPress={() =>{this.pushToSearch()}}
            >
                <Image source={{uri:'search_icon_20x20'}} style={styles.navbarRightItemStyle}/>
            </TouchableOpacity>
        );
    }
    //跳转到某个页面
    pushToHalfHourHot() {
        this.props.navigator.push({
            component:HalfHourHot,
            animationType:Navigator.SceneConfigs.FloatFromBottom,
        })
    }
    //跳转搜索页面
    pushToSearch(){
        this.props.navigator.push({
            component:Search,
        })
    }

    //1. 组件加载完成
    componentDidMount() {
        this.fetchData();
    }

    //2.网络请求post
    fetchData(resolve) {
        let formData = new FormData();
        formData.append('count','10');
        // formData.append('mall','京东商城');
        setTimeout(() =>{
            fetch('https://guangdiu.com/api/getlist.php', {
                method:"POST",
                headers:{},
                body:formData,
            })
            .then((response) =>response.json())
            .then((responseData) =>{
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(responseData.data),
                        loaded:true,
                    });
                    if (resolve !== undefined){
                        setTimeout(() =>{
                            resolve();// 关闭动画
                        },1000);
                    }
            }).done();
        });
    }

    // 3.根据网络状态决定是否渲染 listview
    renderListView(){
        if (this.state.loaded === false){
            return(
                <NoDataView />
            );
        }else{
            return(
                <PullList
                    onPullRelease={(resolve) =>this.fetchData(resolve)}   // 下拉刷新操作
                    dataSource={this.state.dataSource}    // 设置数据源
                    renderRow={this.renderRow}         // 根据数据创建相应 cell
                    showsHorizontalScrollIndicator={false}   // 隐藏水平指示器
                    style={styles.listViewStyle}
                    initialListSize={7}    // 优化:一次渲染几条数据

                    onEndReached={this.loadMore}                // 当接近底部特定距离时调用
                    onEndReachedThreshold={30}                  // 当接近底部60时调用
                    renderFooter={this.renderFooter}            // 设置尾部视图

                />
            );
        }
    }

    // 4.返回每一行cell的样式
    renderRow(rowData) {
        return(
            <CommunalHotCell
                image={rowData.image}
                title={rowData.title}
            />
        );
    }
    //5. 加载更多
    loadMore(){
        fetch('http://guangdiu.com/api/gethots.php')
            .then((response) => response.json()) // json方式解析，如果是text就是 response.text()
            .then((responseData) => {  // 获取到的数据处理
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    loaded:true,
                });
            })
            .done()
    }

    // 设置尾部视图
    renderFooter() {
        return (
            <View style={{height: 100}}>
                <ActivityIndicator />
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {/*设置导航栏样式 1.引用外部文件；2.<CommunalNavBar ...参数/> */}
                <CommunalNavBar
                    leftItem = {() => this.renderLeftItem()}
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}
                />
                {this.renderListView()}
            </View>
        );
    }
}

//justifyContent 主轴
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
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
    listViewStyle: {
        width:width,
    },
});
