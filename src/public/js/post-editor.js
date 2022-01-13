// import EditorJS from '@editorjs/editorjs'; 
// import Header from '@editorjs/header'; 
// import List from '@editorjs/list'; 
// import Embed from '@editorjs/embed'

const editor = new EditorJS({ 
    holder: 'content', 
    tools: {
        header: {
            class: Header,
            inlineToolbar: ['link'],
            config: {
                placeholder: 'Header'
            }
        },
           /**
         * Or pass class directly without any configuration
         */
        image: {
            class: SimpleImage,
            inlineToolbar: ['link'],
        },
        list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L'
        }
    }
})