$(function() {
    // 一：发送ajax请求，获取所有的文章类别，然后通过模板引擎的方式渲染到下拉菜单中
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function(res) {
            // console.log(res);
            if (res.code == 200) {
                // 通过模板引擎 渲染到下拉菜单中
                var resHtml = template('category_temp', res);
                $('#selCategory').html(resHtml);
            }
        }
    });


    //---------------------------------------------
    var currentPage = 1; //当前页码

    // 封装： 发送ajax请求，根据条件获取对应的所有文章数据，封装成一个函数
    // myPage就是当前的页码
    // callback 就是渲染数据完成后要做的事情
    function getData(myPage, callback) {
        $.ajax({
            type: 'get',
            url: BigNew.article_query,
            data: {
                type: $('#selCategory').val(), //选中的文章类别，默认是所有分类
                state: $('#selStatus').val(), //状态（草稿/发布），默认是所有的状态
                page: myPage, //页码每次调用的时候不一样，所以不能写死
                perpage: 6
            },
            success: function(backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    // 调用模板引擎核心方法
                    var resHtml = template('articleList_temp', backData);
                    $('tbody').html(resHtml);

                    // 额外的事情
                    // 判断响应回来有数据
                    if (backData.data.data.length != 0 && callback != null) {
                        // 有数据
                        $('#pagination').show().next('p').hide();
                        //把获取回来的数据在调用callback的时候作为实参传递
                        callback(backData);
                    }
                    // 如果你当前也是1，并且发送ajax请求又没有文章数，那就说明你的这个文章分类中确实没有文章
                    else if (backData.data.data.length == 0 && currentPage == 1) {
                        // 没有数据
                        $('#pagination').hide().next('p').show();
                    } else if (backData.data.totalPage == currentPage - 1 && backData.data.data.length == 0) {
                        currentPage -= 1;
                        // 重新的绘制分页结构
                        $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, currentPage);
                    }
                }
            }
        });
    }





    // 二：一进到页面，发送ajax请求，获取默认的文章类别/文章状态 下的所有文章
    getData(1, function(backData) {
        // 分页插件的方法
        $('#pagination').twbsPagination({
            totalPages: backData.data.totalPage, // 总页数
            visiblePages: 7, //最大的课件页数
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',
            // 页码点击的回调函数事件
            onPageClick: function(event, page) {
                currentPage = page; //给当前页码赋值
                // 发送ajax请求,把当前点击的页码传进去
                getData(page, null); //调用我们自己封装的方法
            }
        });

    })

    // 三：点击筛选按钮获取符合条件的文章渲染到页面上
    $('#btnSearch').on('click', function(e) {
        // 阻止默认的提交行为
        e.preventDefault();
        // 把当前页改成1
        currentPage = 1;
        // 发送ajax请求
        getData(1, function(backData) {
            // 点击筛选按钮，由于改变了条件，所以筛选出来的数据总页码会发生改变
            // 所以要根据新的总页数，来重新绘制 分页结构
            $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, currentPage);

        });
    })






















    // -----------------------------------------
    // 二：一进到页面，发送ajax请求，获取默认的文章类别/文章状态 下的所有文章
    // $.ajax({
    //     type: 'get',
    //     url: BigNew.article_query,
    //     data: {
    //         type: $('#selCategory').val(), //选中的文章类别，默认是所有分类
    //         state: $('#selStatus').val(), //状态（草稿/发布），默认是所有的状态
    //         page: 1,
    //         perpage: 6
    //     },
    //     success: function(backData) {
    //         // console.log(backData);
    //         if (backData.code == 200) {
    //             // 调用模板引擎核心方法
    //             var resHtml = template('articleList_temp', backData);
    //             $('tbody').html(resHtml);

    //             // 分页插件的方法
    //             $('#pagination').twbsPagination({
    //                 totalPages: backData.data.totalPage, // 总页数
    //                 visiblePages: 7, //最大的课件页数
    //                 first: '首页',
    //                 prev: '上一页',
    //                 next: '下一页',
    //                 last: '尾页',
    //                 // 页码点击的回调函数事件
    //                 onPageClick: function(event, page) {
    //                     // 发送ajax请求,把当前点击的页码传进去
    //                     $.ajax({
    //                         type: 'get',
    //                         url: BigNew.article_query,
    //                         data: {
    //                             type: $('#selCategory').val(), //选中的文章类别，默认是所有分类
    //                             state: $('#selStatus').val(), //状态（草稿/发布），默认是所有的状态
    //                             page: page, //此时这里是点击的页码
    //                             perpage: 6
    //                         },
    //                         success: function(backData) {
    //                             // console.log(backData);
    //                             if (backData.code == 200) {
    //                                 // 调用模板引擎核心方法
    //                                 var resHtml = template('articleList_temp', backData);
    //                                 $('tbody').html(resHtml);
    //                             }
    //                         }
    //                     });

    //                 }
    //             });
    //         }
    //     }
    // });

    //-----------------------------------------



    // 四：删除文章：
    // 给删除按钮设置点击事件（委托注册）
    $('tbody').on('click', '.delete', function() {
        if (confirm('你确定要删除吗？')) {
            // 通过当前点击的删除按钮（a标签）的这个自定义属性(data-id)来获取当前要删除的文章id
            var articleId = $(this).attr('data-id');
            // 发送ajax请求完成删除
            $.ajax({
                type: 'post',
                url: BigNew.article_delete,
                data: {
                    id: articleId
                },
                success: function(backData) {
                    console.log(backData);
                    if (backData.code == 204) {
                        // 删除成功，要重新加载数据
                        // 由于删除了数据，那总得页码就有可能减少
                        // 那就应该根据新的总页码重新生成分页结构
                        getData(currentPage, function(backData) {
                            $('#pagination').twbsPagination('changeTotalPages', backData.data.totalPage, currentPage);
                        });
                    }
                }
            });
        }
    });



    // 五：点击发表文章按钮
    // 左边导航栏，导航到发表文章那里
    $('#release_btn').on('click', function() {
        parent.$('ul.level02>li:eq(1)').click();
    });
























})