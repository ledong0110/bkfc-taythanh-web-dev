// CREATE EDITOR
const editor = new EditorJS({ 
    autofocus: true,
    holder: 'content', 
    tools: {
        // HEADER TOOL
        header: {
            class: Header,
            inlineToolbar: true,
            config: {
                placeholder: 'Header'
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
    }
});

// AJAX POST REQUEST
function formPostpromise(){
    return new Promise((resolve, reject) => {
        editor.save().then(outputData => {
            console.log("data:", outputData);
            dataStr.push({name: "content", value: dataStr});
            console.log("submited content", dataStr["content"])
            console.log("Data submitted: ", dataStr);
        });
    })
}

async function formPostasync(){
    try{
        let formPromise = formPostpromise();
        let responseBody = await formPromise;
    }
    catch(e){
        console.log(e);
    }
}

$(function(){
    $("form.post-submit-form").on("submit", function(e){
        e.preventDefault();
        var dataStr = $(this).serializeArray();
        // (async function(){
        //     await formPostpromise();
        // })();

        // async function saveEditor(){ 
        //         return new Promise((resolve, reject) => {
        //             editor.save().then(outputData => {
        //                 console.log("data:", outputData);
        //                 dataStr.push({name: "content", value: outputData});
        //                 console.log("Data submitted: ", dataStr);
        //             });
        //         });
        // }
        
        editor.save().then(outputData => {
            console.log("data:", Object.values(outputData));
            dataStr.push({name:"content", value: JSON.stringify(outputData)});
            // dataStr.push(outputData);
            // dataStr["content"] = outputData;
            console.log("Data submitted: ", dataStr);
            $.ajax({
                type: "POST",
                url: "/post/create",
                // type: $(this).attr("method"),
                // url: $(this).attr("action"),
                data: dataStr,
                success: ()=>{
                    console.log("Uploaded post:", dataStr);
                }
            })
        });

        // saveEditor();
        // console.log("Will upload:", dataStr);
        // $.ajax({
        //     type: "POST",
        //     url: "/post/create",
        //     // type: $(this).attr("method"),
        //     // url: $(this).attr("action"),
        //     data: dataStr,
        //     success: ()=>{
        //         console.log("Uploaded post:", dataStr);
        //     }
        // })
    });
});