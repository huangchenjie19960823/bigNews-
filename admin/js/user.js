// 入口函数
$(function() {
    // 编辑第一步：
    // 一进到页面，就发送ajax请求，获取所有的个人信息，显示在对应的标签中
    $.ajax({
        type: 'get',
        url: BigNew.user_detail,
        success: function(backData) {
            if (backData.code == 200) {
                // 个人信息显示在对应的标签中
                // $('.username').val(backData.data.username);
                // $('.nickname').val(backData.data.nickname);
                // $('.email').val(backData.data.email);
                // $('.password').val(backData.data.password);
                // 以下为简写：
                // 上面注释的这几句话，完全可以用for in 代替
                for (var key in backData.data) {
                    $('.' + key).val(backData.data[key]);
                }


                $('img.user_pic').attr('src', backData.data.userPic);
            }
        }
    });

    // 二：处理图片预览
    // 给选中图像的input标签设置值改变change事件
    // change：值改变事件
    $('#exampleInputFile').on('change', function() {
        // 2. 获取选中的这个头像
        var file1 = this.files[0];
        // 3. 给这个头像文件设置一个url
        var url = URL.createObjectURL(file1);
        // 4. 把这个url赋值给预览用的img的src属性
        $('.user_pic').attr('src', url);
    })


    // 三： 个人中心编辑第二步
    // 1. 给修改的按钮设置点击事件
    $('.btn-edit').on('click', function(e) {
        // 取消form表单中submit的默认提交行为
        e.preventDefault();

        // 2.获取所有修改后的信息
        // form的创建
        var form1 = document.querySelector('form'); // dom元素
        var fd = new FormData(form1);
        // 检查form表单中，需要获取数据的标签是否有name属性，以及name属性的值是否和接口的键一致
        // 3.发送ajax请求
        $.ajax({
            type: 'post',
            url: BigNew.user_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function(backData) {
                if (backData.code == 200) {
                    alert('更新成功');
                    // 4. 完成修改，主页更新新的内容
                    // 第一种：直接更新页面
                    // 父窗口来个reload() 重新更新加载父页面
                    // parent.window.location.reload();

                    // 第二种：发送ajax请求，获取新的个人信息，显示对应的标签
                    $.ajax({
                        type: 'get',
                        url: BigNew.user_info, //使用的是http.js中的接口地址
                        success: function(res) {
                            // console.log(res);
                            // 1.2 个人信息显示在页面上
                            if (res.code == 200) {
                                parent.$('.user_info>span>i').text(res.data.nickname);
                                parent.$('.user_info>img').attr('src', res.data.userPic);
                                parent.$('.user_center_link>img').attr('src', res.data.userPic);
                            }
                        }
                    });

                }
            }
        });
    })











})