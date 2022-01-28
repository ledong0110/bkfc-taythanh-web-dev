// CREATE EDITOR
const editor = new EditorJS({ 
    autofocus: true,
    holder: 'content',
    tools: {
        // PARAGRAPH TOOL
        paragraph: {
            class: Paragraph,
            inlineToolbar: true,
        },

        // HEADER TOOL
        header: {
            class: Header,
            inlineToolbar: true,
            config: {
                defaultLevel: 5
            }
        },

        // IMAGE TOOL
        image: SimpleImage,
        image: {
            class: SimpleImage,
            inlineToolbar: true,
        },

        // LIST TOOL
        list: {
            class: List,
            inlineToolbar: true,
        }
    },
    data: postContent
});

console.log(postContent);

$(function(){
    $("form.post-submit-form").on("submit", function(e){
        e.preventDefault();
        var dataStr = $(this).serializeArray();
        
        editor.save().then(outputData => {
            console.log("data:", Object.values(outputData));
            dataStr.push({name:"content", value: JSON.stringify(outputData)});
        
            console.log("Data submitted: ", dataStr);
            $.ajax({
                type: "POST",
                url: "/post/edit",
                data: dataStr,
                success: ()=>{
                    console.log("sent post to server:", dataStr);
                    Swal.fire(
                        'Đã lưu !',
                        'Update rồi nha, kiểm tra ik',
                        'success'
                    ).then(()=>{
                        window.location="/dashboard/post-manage";
                    })
                    
                }
            })
        });
    });
});