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
    Modal,
    AsyncStorage,
} from 'react-native';

const {width, height} = Dimensions.get("window");
import {Navigator} from 'react-native-deprecated-custom-components';
import {PullList} from 'react-native-pull';
//当前文件夹下 一个.
import CommunalNavBar from '../main/GDCommunalNavBar';
import HalfHourHot from './GDHalfHourHot';
import Search from '../main/GDSearch';
import NoDataView from '../main/GDNoDataView';
import CommunalHotCell from '../main/GDCommunalHotCell';
import CommunalDetail from '../main/GDCommunalDetail';
// import HTTPBase from '../http/HTTPBase';
import RealmStorage from '../storage/realmStorage';

//主界面
export default class GDHome extends Component {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loaded: false,
            isModal: false,
        };
        this.data = [];//存放数据
        // 绑定
        this.loadData = this.loadData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    //返回左边的按钮
    renderLeftItem() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.pushToHalfHourHot()
                }}
            >
                <Image source={{uri: 'hot_icon_20x20'}} style={styles.navbarLeftItemStyle}/>
            </TouchableOpacity>
        );
    }

    renderTitleItem() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.showID();
                }}
            >
                <Image source={{uri: 'navtitle_home_down_66x20'}} style={styles.navbarTitleItemStyle}/>
            </TouchableOpacity>
        );
    }

    showID(){
        AsyncStorage.getItem('cnlastID')
            .then((value) =>{
                alert(value);
            })
    }

    //返回右边的按钮
    renderRightItem() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.pushToSearch()
                }}
            >
                <Image source={{uri: 'search_icon_20x20'}} style={styles.navbarRightItemStyle}/>
            </TouchableOpacity>
        );
    }

    //跳转到某个页面
    pushToHalfHourHot() {
        // this.props.navigator.push({
        //     component:HalfHourHot,
        //     animationType:Navigator.SceneConfigs.FloatFromBottom,
        // })
        this.setState({
            isModal: true
        });
    }

    //跳转搜索页面
    pushToSearch() {
        this.props.navigator.push({
            component: Search,
        })
    }

    //1. 组件加载完成
    componentDidMount() {
        this.loadData();
    }

    //2.网络请求post
    loadData(resolve) {
        let params = {'count': 10};
        HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
            .then((responseData) => {
                //清空数据
                this.data = [];

                //拼接数据
                this.data = this.data.concat(responseData.data);
                //重新渲染
                this.setState({
                    // dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    dataSource: this.state.dataSource.cloneWithRows(this.data), //用保存的data更新数据
                    loaded: true,
                });
                if (resolve !== undefined) {
                    setTimeout(() => {
                        resolve();// 关闭动画
                    }, 1000);
                }
                //存储数组中最后一个元素的id  responseData.data是个数组
                let cnlastID = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('cnlastID', cnlastID.toString());
                //存储数组中第一个元素的id
                let cnfirstID = responseData.data[0].id;
                AsyncStorage.setItem('cnfirstID', cnfirstID.toString());

            })
            .catch((error) => {

            }).done();
    }

    // 3.根据网络状态决定是否渲染 listview
       renderListView() {
        if (this.state.loaded === false) {
            return (
                <NoDataView />
            );
        } else {
            // renderRow={this.renderRow}         // 根据数据创建相应 cell
            return (
                <PullList
                    onPullRelease={(resolve) => this.loadData(resolve)}   // 下拉刷新操作
                    dataSource={this.state.dataSource}    // 设置数据源

                    renderRow={this.renderRow.bind(this)}         // 根据数据创建相应 cell
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
        return (
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

    pushToDetail(value){
        this.props.navigator.push({
            component:CommunalDetail,
            params: {
                url: 'https://guangdiu.com/api/showdetail.php' + '?' + 'id=' + value
            }
        });
        //之前没有;导致了页面白屏
    }

    // 加载更多数据操作
    loadMore() {
        AsyncStorage.getItem('cnlastID')
            .then((value) => {
                // 加载更多数据
                this.loadMoreData(value);
            })
    }

    // 加载更多数据的网络请求
    loadMoreData(value) {
        // 初始化参数对象
        let params = {
            "count" : 10,
            "sinceid" : value
        };

        // 加载更多数据请求
        HTTPBase.get('https://guangdiu.com/api/getlist.php', params)
            .then((responseData) => {
                //拼接数据
                this.data = this.data.concat(responseData.data);

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.data), // //用保存的data更新数据
                    loaded:true,
                });
                //存储数组中最后一个元素的id  responseData.data是个数组
                let cnlastID = responseData.data[responseData.data.length - 1].id;
                console.log(responseData.data);
                AsyncStorage.setItem('cnlastID', cnlastID.toString());


            })
            .catch((error) => {
                // 网络等问题处理
                //拿到本地存储的数据，展示出来，没有数据显示无数据页面
            })
    }

    // 设置尾部视图
    renderFooter() {
        return (
            <View style={{height: 100}}>
                <ActivityIndicator />
            </View>
        );
    }

    onRequestClose() {
        this.setState({
            isModal: false
        });
    }

    closeModal(data) {
        this.setState({
            isModal: data
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType='slide'
                    transparent={false}
                    visible={this.state.isModal}
                    onRequestClose={() => {
                        this.onRequestClose()
                    }}
                >

                    {/* 包装导航功能  <HalfHourHot removeModal={(data) => this.closeModal(data)}/>*/}
                    <Navigator
                        initialRoute={{
                            name:'halfHourHot',
                            component:HalfHourHot
                        }}

                        renderScene={(route, navigator) => {
                            let Component = route.component;
                            return <Component
                                removeModal={(data) => this.closeModal(data)}
                                {...route.params}
                                navigator={navigator} />
                        }} />
                </Modal>
                {/*设置导航栏样式 1.引用外部文件；2.<CommunalNavBar ...参数/> */}
                <CommunalNavBar
                    leftItem={() => this.renderLeftItem()}
                    titleItem={() => this.renderTitleItem()}
                    rightItem={() => this.renderRightItem()}
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
    navbarLeftItemStyle: {
        width: 20,
        height: 20,
        marginLeft: 15,
    },
    navbarTitleItemStyle: {
        width: 66,
        height: 20,
    },
    navbarRightItemStyle: {
        width: 20,
        height: 20,
        marginRight: 15,
    },
    listViewStyle: {
        width: width,
    },
});
