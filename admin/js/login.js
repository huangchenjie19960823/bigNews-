$(function () {
    // 1.1 给登录的按钮设置一个点击事件
    $('.input_sub').on('click', function (e) {
        // 1.2 阻止form表单中的submit的默认提交行为
        e.preventDefault();

        // 1.3 获取用户输入的账号跟密码
        var username = $('.input_txt').val().trim(); //账号
        var password = $('.input_pass').val().trim(); //密码

        // 1.4 非空判断
        if (username == '' || password == '') {
            // alert('账号或密码不能为空！');
            $('#myModal .modal-body>p').text('账号和密码不能为空');
            $('#myModal').modal(); //js代码方式弹出bootstrap模态框
            return;
        }
        // 1.5 发送ajax请求完成登陆
        $.ajax({
            type: 'post',
            // url: 'http://localhost:8080/api/v1/admin/user/login',
            url: BigNew.user_login,  //使用http.js里面报错的接口地址
            data: {
                username: username,
                password: password
            },
            success: function (res) {
                console.log(res);
                if (res.code == 200) {
                    // 1.6 如果账号密码有误，提示一下
                    // alert('登录成功');
                    $('#myModal .modal-body>p').text('登录成功');

                    $('#myModal').modal(); //js代码方式弹出bootstrap模态框
                    // 页面跳转应该放在模态框关闭里面
                    $('#myModal').on('hidden.bs.modal', function (e) {
                        // 把服务器返回回来的token令牌保存起来
                        localStorage.setItem('token', res.token);
                        // 跳转到首页
                        window.location.href = './index.html';
                    })
                } else {
                    // 1.7 如果账号密码没有错误，提示登陆成功，跳转到首页
                    // alert('账号或者密码有误');
                    $('#myModal .modal-body>p').text('账号或者密码有误');

                    $('#myModal').modal(); //js代码方式弹出bootstrap模态框
                }

            }
        });
    })





})