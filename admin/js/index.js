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
        // url: 'http://localhost:8080/api/v1/admin/user/info',
        url: BigNew.user_info, //使用的是http.js中的接口地址
        // 设置请求头（键，值）
        // headers: {
        //     'Authorization': localStorage.getItem('token')
        // },
        success: function(res) {
            console.log(res);
            // 1.2 个人信息显示在页面上
            if (res.code == 200) {
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
        if (confirm('你确定要退出吗？')) {
            // 删除token
            localStorage.removeItem('token');

            // 跳转到登录页面
            window.location.href = './login.html';
        }
    })


    // 三：左侧一级菜单（首页、文章管理、评论管理、个人中心）设置点击事件
    $('div.level01').on('click', function() {
        // 3.1 当前点击的这个一级菜单添加active类，其他的兄弟一级菜单移除这个active类
        $(this).addClass('active').siblings('div').removeClass('active');
        // 3.2 判断一下当前点击的是否是文章管理这个一级菜单
        if ($(this).index() == 1) {
            // 二级菜单显示就隐藏，隐藏就显示
            $('ul.level02').slideToggle();
            // 小尖尖要做c3动画（ 实际就是添加 / 移除一个类rotate0）
            $(this).find('b').toggleClass('rotate0');

            // 触发第一个二级菜单（文章列表）的点击事件
            $('ul.level02>li:eq(0)').trigger('click');
        }
    })

    // 四：左侧二级菜单（文章列表、发表文章、文章类别管理）点击事件的
    $('ul.level02>li').on('click', function() {
        // 当前点击的二级菜单添加active类，其他的兄弟二级菜单移除这个类
        $(this).addClass('active').siblings('li').removeClass('active');

        // 待解决的需求：
        // 点击一级菜单 “文章管理” 默认选中二级菜单 “文章列表”
        // 简单做法：
        // 第1步： 先在index.html页面第32行的a标签更改： < a href = "./article_list.html" target = "main_frame" >
        // 第2步：在此页面的第三大步骤里面第72行输入：
        // 触发第一个二级菜单（文章列表）的点击事件
        // $('ul.level02>li:eq(0)').trigger('click');
        // 第3步：这样写完结束

        // 困难做法：
        // 直接在此页面第72行写上(不需要更改html页面的任何东西)：
        // 是给一级菜单“文章管理”下面的二级菜单（“文章列表”），里面的a标签转成dom元素，出发他的单击事件
        // a.他这里有事件冒泡，触发a单击事件，冒泡就会触发a的父亲li的单击事件
        // b.dom元素的单击事件会触发超链接
        // $('ul.level02>li:eq(0)>a')[0].click();
        // 一句话结束，代码更简单但是理解会难点
        // 首先你要明白给谁注册事件：
        // 第一个 二级菜单（ 文章列表） 里面的a标签， 转成dom对象， 触发他的单击事件，
        // a标签的dom元素的单击事件，不仅会触发单击事件，还会触发超链接
        // 触发单击事件，会触发事件冒泡，那不就相当于触发了她的父亲也就是li标签的单击事件吗
        // 那不就有了选中的文字颜色了吗
    })







})