/**
 * Created by PVer on 2017/7/23.
 */


var HTTPBase = {};
// 使用var声明的变量，其作用域为该语句所在的函数内，且存在变量提升现象；
// 使用let声明的变量，其作用域为该语句所在的代码块内，不存在变量提升；
// 使用const声明的是常量，在后面出现的代码中不能再修改该常量的值。
/**
 * GET请求
 * @param url
 * @param params
 * @return {Promise对象}
 * */
HTTPBase.get = function (url, params, headers) {
    if (params) {
        let paramsArray = [];
        // 获取 params 内所有的 key
        let paramsKeyArray = Object.keys(params);
        // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
        paramsKeyArray.forEach(key => paramsArray.push(key + '=' + params[key]));
        //网址拼接/标识开始 /标识结束
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        }else {
            url += paramsArray.join('&');
        }
    }

    return new Promise(function (resolve, reject) {
        fetch(url, {
            method:'GET',
            headers:headers
        })
            .then((response) => response.json())
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject({status:-1})
            })
            .done();
    })
};
// setTimeout(() =>{
//     fetch('http://guangdiu.com/api/gethots.php')
//         .then((response) => response.json()) // json方式解析，如果是text就是 response.text()
//         .then((responseData) => {  // 获取到的数据处理
//             this.setState({
//                 dataSource: this.state.dataSource.cloneWithRows(responseData.data),
//                 loaded:true,
//             });
//             if (resolve !== undefined) {
//
//                 setTimeout(() =>{
//                     resolve();  // 关闭动画
//                 },1000);
//             }
//         })
//         .done()
// },1000);

/**
 * POST请求
 * @param url
 * @param params {}包装
 * @param headers
 * @return {Promise}
 * */
HTTPBase.post = function (url, params, headers) {
    if (params) {
        // 初始化FormData
        var formData = new FormData();

        // 获取 params 内所有的 key
        let paramsKeyArray = Object.keys(params);
        // 通过 forEach 方法拿到数组中每个元素,将元素与参数的值进行拼接处理,并且放入 paramsArray 中
        paramsKeyArray.forEach(key => formData.append(key, params[key]));
    }

    return new Promise(function (resolve, reject) {
        fetch(url, {
            method:'POST',
            headers:headers,
            body:formData,
        })
            .then((response) => response.json())
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject({status:-1})
            })
            .done();
    })
};

//2.网络请求post
// fetchData(resolve) {
//     let formData = new FormData();
//     formData.append('count','10');
//     // formData.append('mall','京东商城');
//     setTimeout(() =>{
//         fetch('https://guangdiu.com/api/getlist.php', {
//             method:"POST",
//             headers:{},
//             body:formData,
//         })
//             .then((response) =>response.json())
//             .then((responseData) =>{
//                 this.setState({
//                     dataSource:this.state.dataSource.cloneWithRows(responseData.data),
//                     loaded:true,
//                 });
//                 if (resolve !== undefined){
//                     setTimeout(() =>{
//                         resolve();// 关闭动画
//                     },1000);
//                 }
//             }).done();
//     });
// }

// module.exports  = HTTPBase; //输出一个接口，每个地方都需要引用
global.HTTPBase = HTTPBase;  //引入一次，home前面用到就引用
