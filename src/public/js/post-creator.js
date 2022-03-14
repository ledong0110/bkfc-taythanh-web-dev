// CREATE EDITOR
const editor = new EditorJS({
    autofocus: true,
    holder: 'content',
    placeholder:
        "Let's write something >> Click the '+' sign to add header, list or paste image link to insert image",
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
                placeholder: 'Header',
                defaultLevel: 5,
            },
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
        },
        // COLOR FONT TOOL
        Color: {
            class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
            config: {
                colorCollections: [
                    '#000',
                    '#FF1300',
                    '#EC7878',
                    '#9C27B0',
                    '#673AB7',
                    '#3F51B5',
                    '#0070FF',
                    '#03A9F4',
                    '#00BCD4',
                    '#4CAF50',
                    '#8BC34A',
                    '#CDDC39',
                    '#FFF',
                ],
                defaultColor: '#FF1300',
                type: 'text',
            },
        },
    },
});

// AJAX POST REQUEST
// function formPostpromise(){
//     return new Promise((resolve, reject) => {
//         editor.save().then(outputData => {
//             console.log("data:", outputData);
//             dataStr.push({name: "content", value: dataStr});
//             console.log("submited content", dataStr["content"])
//             console.log("Data submitted: ", dataStr);
//         });
//     })
// }

// async function formPostasync(){
//     try{
//         let formPromise = formPostpromise();
//         let responseBody = await formPromise;
//     }
//     catch(e){
//         console.log(e);
//     }
// }

$(function () {
    $('form.post-submit-form').on('submit', function (e) {
        e.preventDefault();
        var dataStr = $(this).serializeArray();

        editor.save().then((outputData) => {
            console.log('data:', Object.values(outputData));
            dataStr.push({
                name: 'content',
                value: JSON.stringify(outputData),
            });

            console.log('Data submitted: ', dataStr);
            $.ajax({
                type: 'POST',
                url: '/post/create',
                // type: $(this).attr("method"),
                // url: $(this).attr("action"),
                data: dataStr,
                success: () => {
                    console.log('Uploaded post:', dataStr);
                    Swal.fire(
                        'Uploaded !',
                        'Your post is now online',
                        'success',
                    ).then(() => {
                        window.location.reload();
                    });
                },
            });
        });
    });
});



function preview() {
    form = $('form.post-submit-form');
    var dt = form.serializeArray();
    editor.save()
        .then((outputData) => {
            console.log('data:', Object.values(outputData));
            dt.push({
                name: 'content',
                value: JSON.stringify(outputData),
            });
            return dt;
        })
        .then( (dt) => {
            $.ajax({
                method: 'POST',
                url: '/post/preview',
                data: dt,
                success: (res) => {
                    
                   console.log(res);
                   window.open('/post/preview?id=62107375d8ed192260884712', '_blank');
                },
            });
        });
};