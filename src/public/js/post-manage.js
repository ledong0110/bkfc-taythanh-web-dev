// TOP PAGE POST
$(function(){
    $("form.top-post-submit-form").on("submit", function(e){
        e.preventDefault();
        var dataStr_arr = $(this).serializeArray();
        console.log(dataStr_arr);
        var dataStr = {};
        let dataLength = 0;
        for (let i = 0; i < dataStr_arr.length; i++){
            let ele = dataStr_arr[i];
            if (dataStr[ele.name] != 1){
                dataStr[ele.name] = Number(ele.value); 
            }
            else{
                dataStr[ele.name] = Number(1); 
            }
            if (ele.value == 1) dataLength += 1;
        }
        // console.log(dataStr);
        if(dataLength <= 3){
            // console.log(dataStr);
            var callback = $.ajax({
                type: "POST",
                url: "/dashboard/post-manage/top-post",
                data: dataStr,
                success: ()=>{
                    // console.log("Update top:", dataStr);
                    var headerdata = callback.getResponseHeader('signal');
                    if (headerdata == 1){
                        Swal.fire(
                            'Đã lưu',
                            'Qua trang chủ kiểm tra được chưa mate',
                            'success'
                        )
                    }
                    else{
                        Swal.fire(
                            'Chưa được lưu',
                            'Lỗi gì gòi, hỏi thằng làm web xem',
                            'error'
                        )
                    }
                }
            })
            
        }
        else{
            Swal.fire(
                'Không lưu được',
                'Trời ơi, đã nói là tối đa 3 bài thôi !!!',
                'error'
            )
        }
    })
});

// HOT PAGE POST
$(function(){
    $("form.hot-post-submit-form").on("submit", function(e){
        e.preventDefault();
        var dataStr_arr = $(this).serializeArray();
        // console.log(dataStr_arr);
        var dataStr = {};
        let dataLength = 0;
        for (let i = 0; i < dataStr_arr.length; i++){
            let ele = dataStr_arr[i];
            if (dataStr[ele.name] != 1){
                dataStr[ele.name] = Number(ele.value); 
            }
            else{
                dataStr[ele.name] = Number(1); 
            }
            if (ele.value == 1) dataLength += 1;
        }
        // console.log(dataStr);
        if(dataLength <= 6){
            // console.log(dataStr);
            var callback = $.ajax({
                type: "POST",
                url: "/dashboard/post-manage/hot-post",
                data: dataStr,
                success: ()=>{
                    // console.log("Update pop:", dataStr);
                    var headerdata = callback.getResponseHeader('signal');
                    if (headerdata == 1){
                        Swal.fire(
                            'Đã lưu',
                            'Qua trang chủ kiểm tra được chưa mate',
                            'success'
                        )
                    }
                    else{
                        Swal.fire(
                            'Chưa được lưu',
                            'Lỗi gì gòi, hỏi thằng làm web xem',
                            'error'
                        )
                    }
                }
            })
        }
        else{
            Swal.fire(
                'Không lưu được',
                'Trời ơi, đã nói là tối đa 6 bài thôi !!!',
                'error'
            )
        }
    })
});

// TOP POST CLEAR
$(function(){
    $("form.top-post-submit-form").on("click",".clear-all-btn",function(e){
        $("form.top-post-submit-form")[0].reset();
    })
})

// HOT POST CLEAR
$(function(){
    $("form.hot-post-submit-form").on("click",".clear-all-btn",function(e){
        $("form.hot-post-submit-form")[0].reset();
    })
})

//DELETE POST
$(function(){
    $("form.delete-form").on("submit", function(e){
        e.preventDefault();

        Swal.fire({
            title: 'Bạn có chắc muốn xóa bài này?',
            text: "Bài viết sau khi xóa sẽ đươc lưu trữ thùng rác",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa luôn!'
            }).then((result) => {
                if (result.isConfirmed) {
                    var dataStr = $(this).serialize();
                    var callback = $.ajax({
                        type: "DELETE",
                        url: "/post",
                        data: dataStr,
                        success: ()=>{
                            // console.log("Update pop:", dataStr);
                            var headerdata = callback.getResponseHeader('signal');
                            if (headerdata == 1){
                                Swal.fire(
                                    'Đã xóa',
                                    'Qua trang chủ kiểm tra được chưa mate',
                                    'success'
                                ).then(()=>{
                                    window.location.reload();
                                })
                            }
                            else{
                                Swal.fire(
                                    'Chưa xóa',
                                    'Lỗi gì gòi, hỏi thằng làm web xem',
                                    'error'
                                )
                            }
                        }
                    })   
                }
            })
            
        
    })
});