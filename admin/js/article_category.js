$(function() {
    // 一：一进到这个文章类别页面，就要显示所有的文章类别
    // 1.1 发送ajax请求，获取到所有的文章类别
    function getData() {
        $.ajax({
            type: 'get',
            url: BigNew.category_list,
            success: function(backData) {
                console.log(backData);
                if (backData.code == 200) {
                    // 1.2 通过模板引擎发送的方式，渲染到页面上
                    var resHtml = template('category_temp', backData);
                    $('tbody').html(resHtml);
                }
            }
        });
    }
    getData();

    // 二：到底是新增分类按钮 / 编辑按钮 来弹出的模态框
    // show.bs.modal--> 这个事件是在模态框显示的时候出发立即触发的 
    // show 方法调用之后立即触发该事件。 
    // 如果是通过点击某个作为触发器的元素， 则此元素可以通过事件的 relatedTarget 属性进行访问。
    // 给模态框注册事件
    $('#myModal').on('show.bs.modal', function(e) {
        // console.log(e.relatedTarget); // 通过这个方式能够知道是谁弹出的模态框
        if (e.relatedTarget === $('#xinzengfenlei')[0]) {
            // 点击新增分类弹出的
            $('#myModalLabel').text('新增分类');
            $('#btnAddOrEdit').text('新增').addClass('btn-primary').removeClass('btn-success');
        } else {
            // 点击编辑按钮弹出的
            $('#myModalLabel').text('编辑分类');
            $('#btnAddOrEdit').text('编辑').addClass('btn-success').removeClass('btn-primary');

            // 编辑的第一步：
            // 把需要编辑的当前的这一行的文章类别名称和别名，显示在模态框中
            $('#recipient-name').val($(e.relatedTarget).parent().prev().prev().text().trim());
            $('#message-text').val($(e.relatedTarget).parent().prev().text().trim());
            $('#categoryId').val($(e.relatedTarget).attr('data-id'));
        }
    });


    // 三： 给模态框中的 新增 / 编辑 按钮设置点击事件
    $('#btnAddOrEdit').on('click', function() {
        if ($(this).hasClass('btn-primary')) {
            // 判断是点的新增，还是点的编辑：用类或text都可以
            // 新增
            // alert('新增')
            // 获取用户输入的新增的 分类名称和分类别名
            var categoryName = $('#recipient-name').val().trim(); //分类的名称
            var categorySlug = $('#message-text').val().trim(); //分类别名
            // 非空判断，自己去做
            // 发送ajax请求
            $.ajax({
                type: 'post',
                url: BigNew.category_add,
                data: {
                    name: categoryName,
                    slug: categorySlug
                },
                success: function(backData) {
                    if (backData.code == 201) {
                        alert('新增成功');
                        // 更新页面中的数据
                        getData();
                        // 隐藏模态框
                        $('#myModal').modal('hide');
                        // 清空模态框的输入内容
                        $('#recipient-name').val('');
                        var categorySlug = $('#message-text').val('');
                    }
                }
            })

        } else {
            // 编辑
            // alert('编辑')
            // 编辑的第二步：
            // 1. 获取 要编辑的文章类别的名称和别名
            var categoryName = $('#recipient-name').val().trim(); //文章分类名称
            var categorySlug = $('#message-text').val().trim(); //文章分类 别名
            var categoryId = $('#categoryId').val().trim(); //文章分类 id
            // 2. 发送ajax请求完成编辑
            $.ajax({
                type: 'post',
                url: BigNew.category_edit,
                data: {
                    id: categoryId,
                    name: categoryName,
                    slug: categorySlug
                },
                success: function(e) {
                    // console.log(e);
                    if (e.code == 200) {
                        alert('编辑成功');
                        // 3. 编辑成功后要重新加载数据
                        getData();
                        // 隐藏模态框
                        $('#myModal').modal('hide');
                    }

                }
            });


        }
    });


    // 四：删除文章类别
    // 给删除按钮设置点击事件（删除按钮们是动态生成的，所以要委托注册单击事件）
    $('tbody').on('click', '.btn-delete', function() {
        var that = $(this); //把当前电机的这个删除按钮用that保存一下
        if (confirm('你确定要删除吗？')) {
            // 获取当前删除的这个文章类别的id
            var categoryId = $(this).attr('data-id');
            // 发送ajax请求完成删除
            $.ajax({
                type: 'post',
                url: BigNew.category_delete,
                data: {
                    id: categoryId
                },
                success: function(e) {
                    // console.log(e);
                    if (e.code == 204) {
                        alert('删除成功');
                        // 更新数据
                        // 第一种方法：
                        // getData();
                        // 第二种方法：
                        // 直接把这一行删掉：
                        // 在第115行写上：
                        // var that = $(this); //把当前电机的这个删除按钮用that保存一下
                        // 再写以下代码：
                        that.parent().parent().remove();
                    }
                }
            })
        }
    })












})