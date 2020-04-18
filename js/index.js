$(function () {
    load();
    $(".ipt").on("keyup", function (e) {
        if (e.keyCode == 13 && $(".ipt").val() != '') {
            //先读取本地存储原本的数据
            var local = getData();
            //把输入框的内容添加到获取过来的数据中
            local.push({
                title: $(this).val(),
                done: false
            });
            //把最新更新的数据再次保存到本地存储中
            saveData(local);
            //存储到本地存储后，添加到ul下
            load();
            //添加完成后 清空input中的内容
            $(this).val('');
        }
    })

    //点击删除 删除本地存储中删除当前元素 并重新渲染加载
    $("ul,ol").on("click", "a", function () {
        //    获取本地存储
        var data = getData();
        //    修改数据      数组删除 splice(i,1);
        data.splice($(this).attr("index"), 1);
        console.log(data);
        //    保存数据
        saveData(data);
        //    重新渲染
        load();
    })
    //点击复选框 根据复选框当前的状态 决定放到已完成还是未完成里面
    $("ul, ol").on("click", "input", function () {
        var data = getData();
        var index = $(this).siblings("a").attr("index");
        data[index].done = $(this).prop("checked");
        saveData(data);
        load();
    })



    //声明读取本地数据的函数 
    function getData() {
        var data = localStorage.getItem("todolist");
        if (data != null) {
            //本地存储的是字符串类型的 但我们需要对象格式的
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    //声明保存数据到本地存储
    function saveData(data) {
        localStorage.setItem("todolist", JSON.stringify(data));
    }
    //声明渲染加载函数
    function load() {
        $("ol,ul").empty(); //每次调用加载的时候 先清除ul里的元素 然后再重新加载
        var data = getData();
        $.each(data, function (i, ele) {
            if (ele.done == true) {
                $("ol").prepend($("<li><input type='checkbox' checked='checked'><p>" + ele.title + "</p><a href='javascript:;' index = " + i + ">删除</a></li>"))
            } else {
                $("ul").prepend($("<li><input type='checkbox'><p>" + ele.title + "</p><a href='javascript:;' index = " + i + ">删除</a></li>"))
            }
        })
        $(".doList>p").html($("ul>li").length);
        $(".goList>p").html($("ol>li").length);

    }

    // 双击文字，可以修改内容
    // 当我们双击文字，获取本地数据，修改内容，保存，重新加载

    $("ul li,ol li").on("dblclick", "p", function () {
        //双击禁止选中文字
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        //索引号
        var input_index;
        var str = $(this).html();
        $(this).html("<input type='text'/>");
        $(this).children().val(str).select();
        input_index = $(this).siblings("a").attr('index');
        //input 失去焦点事件
        $(this).children(0).on("blur", function () {
            var data = getData();
            data[input_index].title = $(this).val();
            saveData(data);
            load();
        })
        //input 键盘弹起事件
        $(this).children(0).on("keyup", function (e) {
            if (e.keyCode == 13) {
                var data = getData();
                data[input_index].title = $(this).val();
                saveData(data);
                load();
            }
        })
        //阻止input点击冒泡
        $(this).children(0).on("click", function (e) {
            e.stopPropagation();
        })

    })

})