$(function() {
    // 一进到后台首页，就应该获取登录的管理员个人信息，显示在页面上
    // 用原生js发送ajax请求，
    // 如何把token带过去？设置请求头
    // var xhr = new XMLHttpRequest();
    // xhr.open('get', 'http://localhost:8080/api/v1/admin/user/info');
    // xhr.setRequestHeader('Authorization', localStorage.getItem('token')); // 这就是设置请求头('键：后端人员规定的', 存放在localStorage中)
    // xhr.onload = function() {
    //     console.log(xhr.response);
    // }
    // xhr.send();




    // 一进到后台首页，就应该获取登录的管理员个人信息，显示在页面上
    // jQuery发送ajax请求，如何把token令牌带过去呢？也是设置请求头
    // 1.1 发送ajax请求，获取个人信息
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/admin/user/info',
        // 设置请求头（键，值）
        // headers: {
        //     'Authorization': localStorage.getItem('token')
        // },
        success: function(res) {
            console.log(res);
            // 1.2 个人信息显示在页面上
            if(res.code == 200) {
                $('.user_info>span>i').text(res.data.nickname);
                $('.user_info>img').attr('src', res.data.userPic);
                $('.user_center_link>img').attr('src', res.data.userPic);
            }
        }
    });

    // 每一个ajax请求都要设置token令牌，不然人家接口以为你没有登录，那就不给你数据
    // 每一个ajax请求都要设置token令牌，就很烦
    // 那我们就想可不可以在一个地方设置，每次发送ajax请求之前都去执行那个地方
    // 把这种叫做全局设置
    // 我们每次发送ajax请求，都是用jQuery发送的
    // 每次都要引入jQuery，也就是说这个引入的jQuery文件每次都会执行的
    // 所以这个全局设置卸载这个引入的jQuery文件中

    // 二：登出系统
    // 2.1 给登出按钮设置一个点击事件
    $('.logout').on('click', function(e) {
        // 阻止a标签的默认跳转
        e.preventDefault();
        if(confirm('你确定要退出吗？')) {
            // 删除token
            localStorage.removeItem('token');

            // 跳转到登录页面
            window.location.href = './login.html';
        }
    })
    
    
    
})