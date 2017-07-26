/**
 * Created by PVer on 2017/7/26.
 */
/**
 * Created by PVer on 2017/7/21。
 * import TabNavigator from 'react-native-tab-navigator';
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    ListView,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';

const {width,height} = Dimensions.get('window');
//第三方
import {PullList} from 'react-native-pull';
//导航栏的外部文件 .返回上一级
import CommunalNavBar from '../main/GDCommunalNavBar';
import CommunalHotCell from '../main/GDCommunalHotCell';
import CommunalDetail from '../main/GDCommunalDetail';
import NoDataView from '../main/GDNoDataView';
import HTTPBase from '../http/HTTPBase';

//界面
export default class GDUShalfHourHot extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2}),
            loaded:false,
        };
        // 绑定
        this.fetchData = this.fetchData.bind(this);
    }

    static defaultProps = {
        removeModal:{}      // 销毁模态回调
    };

    //发送隐藏通知
    componentWillMount(){
        DeviceEventEmitter.emit('isHiddenTabBar',true);
    }

    componentWillUnmount(){
        DeviceEventEmitter.emit('isHiddenTabBar',false);
    }

    // 返回中间按钮
    renderTitleItem() {
        return(
            <Text style={styles.navbarTitleItemStyle}>近半小时热门</Text>
        );
    }

    // 返回右边按钮
    renderRightItem() {
        return(
            <TouchableOpacity
                onPress={()=>{this.popToHome(false)}}  // onPress={()=>{this.popToHome()}}
            >
                <Text style={styles.navbarRightItemStyle}>关闭</Text>
            </TouchableOpacity>
        );
    }
    //模态的方式把一段代码发送出去
    popToHome(data) {
        //获取导航控制器
        // this.props.navigator.pop();
        this.props.removeModal(data);
    }

    //1. 组件加载完成
    componentDidMount() {
        this.fetchData();
    }

    // 网络请求 通常是通过 Ajax 从服务器获取数据，在 componentDidMount 方法中创建 Ajex 请求，
    //2. 等到请求成功，再用 this.setState 方法重新渲染UI
    fetchData(resolve) {
        let params = {
            "c": "us",
        }
        HTTPBase.get('http://guangdiu.com/api/gethots.php')
            .then((responseData) => {  // 获取到的数据处理
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    loaded:true,
                });
                if (resolve !== undefined) {

                    setTimeout(() =>{
                        resolve();  // 关闭动画
                    },1000);
                }
            })
            .done()
    }

    // 返回每一行cell的样式
    renderRow(rowData) {
        return(
            <TouchableOpacity
                onPress={() => this.pushToDetail(rowData.id)}
            >
                <CommunalHotCell
                    image={rowData.image}
                    title={rowData.title}
                />
            </TouchableOpacity>
        );
    }

    // 跳转到详情页
    pushToDetail(value) {
        this.props.navigator.push({
            component: CommunalDetail,
            params: {
                url: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
            }
        });
    }

    //返回listview头部
    renderHeader(){
        return(
            <View style={styles.headerPromptStyle}>
                <Text>根据每条折扣的点击进行统计,每5分钟更新一次</Text>
            </View>
        );
    }

    // 根据网络状态决定是否渲染 listview
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
                    renderRow={this.renderRow.bind(this)}         // 根据数据创建相应 cell
                    showsHorizontalScrollIndicator={false}   // 隐藏水平指示器
                    style={styles.listViewStyle}
                    initialListSize={5}    // 优化:一次渲染几条数据
                    renderHeader={this.renderHeader}  // 设置头部视图
                />
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/* 导航栏样式 */}
                <CommunalNavBar
                    titleItem = {() => this.renderTitleItem()}
                    rightItem = {() => this.renderRightItem()}
                />
                {/* 顶部提示 */}
                {/*{this.renderHeader()}*/}

                {/*原来放listview*/}
                {this.renderListView()}

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        backgroundColor:'white',
    },

    navbarTitleItemStyle: {
        fontSize:17,
        color:'black',
        marginLeft:50
    },
    navbarRightItemStyle: {
        fontSize:17,
        color:'rgba(123,178,114,1.0)',
        marginRight:15
    },
    listViewStyle: {
        width:width,
    },
    headerPromptStyle: {
        height:44,
        width:width,
        backgroundColor:'rgba(239,239,239,0.5)',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },
});

