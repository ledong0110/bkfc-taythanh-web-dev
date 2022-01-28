const editor = new EditorJS({
    autofocus: true,
    holder: 'editorjs',
    readOnly: true,
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
    }
});
