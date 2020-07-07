$(function() {
    // 一：头像预览
    $('#inputCover').on('change', function() {
        var file1 = this.files[0];
        var url1 = URL.createObjectURL(file1);
        $('.article_cover').attr('src', url1);
    });

    // 二：一进到发表文章页面，就应该显示所有的文章类别
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function(res) {
            // console.log(res);
            if (res.code == 200) {
                // 通过模板引擎 渲染到下拉菜单中
                var resHtml = template('article_category_temp', res);
                $('select.category').html(resHtml);
            }
        }
    });





































});