// import EditorJs from 'react-editor-js'
// import CheckList from '@editorjs/editorjs'
// // import CodeBox from '@bomdi/codebox'
// import Delimiter from '@editorjs/editorjs'
// import Embed from '@editorjs/editorjs'
// import Image from '@editorjs/editorjs'
// import InlineCode from '@editorjs/editorjs'
// import LinkTool from '@editorjs/editorjs'
// import List from '@editorjs/editorjs'
// import Quote from '@editorjs/editorjs'
// import SimpleImage from '@editorjs/editorjs'
// import Header from '@editorjs/editorjs'

// // import API from '../api/image' // Your server url

// const RichTextInput = ({ data, imageArray, handleInstance }: any) => {
//   const EDITOR_JS_TOOLS = {
//     embed: Embed,
//     header: Header,
//     list: List,
//     // codeBox: CodeBox,
//     linkTool: LinkTool,
//     // image: {
//     //   class: Image,
//     //   config: {
//     //     uploader: {
//     //       uploadByFile(file: any) {
//     //         let formData = new FormData()
//     //         formData.append('images', file)
//     //         // send image to server
//     //         return API.imageUpload(formData).then((res: any) => {
//     //           // get the uploaded image path, pushing image path to image array
//     //           imageArray.push(res.data.data)
//     //           return { success: 1, file: { url: res.data.data } }
//     //         })
//     //       }
//     //     }
//     //   }
//     // },
//     quote: Quote,
//     checklist: CheckList,
//     delimiter: Delimiter,
//     inlineCode: InlineCode,
//     simpleImage: SimpleImage
//   }

//   // Editor.js This will show block editor in component
//   // pass EDITOR_JS_TOOLS in tools props to configure tools with editor.js
//   return (
//     <EditorJs
//       instanceRef={(instance: any) => handleInstance(instance)}
//       tools={EDITOR_JS_TOOLS}
//       data={data}
//       placeholder={`Write from here...`}
//     />
//   )
// }

// Return the CustomEditor to use by other components.

// export default RichTextInput
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// import react, { useEffect, useState } from 'react'
// import { $getRoot, $getSelection } from 'lexical'

// import { LexicalComposer } from '@lexical/react/LexicalComposer'
// import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
// import { ContentEditable } from '@lexical/react/LexicalContentEditable'
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
// // import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
// import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

// import TreeViewPlugin from './plugins/TreeViewPlugin'
// import ToolbarPlugin from './plugins/ToolbarPlugin'
// import { HeadingNode, QuoteNode } from '@lexical/rich-text'
// import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
// import { ListItemNode, ListNode } from '@lexical/list'
// import { CodeHighlightNode, CodeNode } from '@lexical/code'
// import { AutoLinkNode, LinkNode } from '@lexical/link'
// import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
// import { ListPlugin } from '@lexical/react/LexicalListPlugin'
// import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
// import { TRANSFORMERS } from '@lexical/markdown'
// import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
// import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
// import AutoLinkPlugin from './plugins/AutoLinkPlugin'

// import { ParagraphNode } from 'lexical'
// import { CustomParagraphNode } from './nodes/CustomParagraphNode'

// const theme = { ltr: 'ltr', rtl: 'rtl', paragraph: 'editor-paragraph' }
// const onError = (err: any) => console.log(err)

// const MyCustomAutoFocusPlugin = () => {
//   const [editor] = useLexicalComposerContext()
//   useEffect(() => {
//     editor.focus() // Focus the editor when the effect fires!
//   }, [editor])
//   return null
// }
// const OnChangePlugin = ({ onChange }: any) => {
//   // Access the editor through the LexicalComposerContext
//   const [editor] = useLexicalComposerContext()
//   // Wrap our listener in useEffect to handle the teardown and avoid stale references.
//   useEffect(() => {
//     // most listeners return a teardown function that can be called to clean them up.
//     return editor.registerUpdateListener(({ editorState }) => {
//       // call onChange here to pass the latest state up to the parent.
//       onChange(editorState)
//     })
//   }, [editor, onChange])
//   return null
// }
// const RichTextInput = () => {
//   const config = {
//     namespace: 'MyEditor',
//     theme,
//     onError,
//     nodes: [
//       HeadingNode,
//       ListNode,
//       ListItemNode,
//       QuoteNode,
//       CodeNode,
//       CodeHighlightNode,
//       TableNode,
//       TableCellNode,
//       TableRowNode,
//       AutoLinkNode,
//       LinkNode,
//       CustomParagraphNode,
//       {
//         replace: ParagraphNode,
//         with: node => {
//           return new CustomParagraphNode()
//         }
//       }
//     ]
//   }

//   const [editorState, setEditorState] = useState()
//   const onChange = (editorState: any) => {
//     // Call toJSON on the EditorState object, which produces a serialization safe string
//     console.log(editorState)
//     const editorStateJSON: string = editorState.toJSON()
//     // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
//     setEditorState(JSON.stringify(editorStateJSON))
//   }

//   return (
//     <LexicalComposer initialConfig={config}>
//       <PlainTextPlugin
//         contentEditable={<ContentEditable />}
//         placeholder={<div>Enter some text...</div>}
//         ErrorBoundary={LexicalErrorBoundary}
//       />

//       <HistoryPlugin />
//       <MyCustomAutoFocusPlugin />
//       <OnChangePlugin onChange={onChange} />
//     </LexicalComposer>
//   )
// }

// export default RichTextInput
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import ExampleTheme from './themes/ExampleTheme'
// import { LexicalComposer } from '@lexical/react/LexicalComposer'
// import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
// import { ContentEditable } from '@lexical/react/LexicalContentEditable'
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
// import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
// import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
// // import TreeViewPlugin from './plugins/TreeViewPlugin'
// // import ToolbarPlugin from './plugins/ToolbarPlugin'
// import { HeadingNode, QuoteNode } from '@lexical/rich-text'
// import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
// import { ListItemNode, ListNode } from '@lexical/list'
// import { CodeHighlightNode, CodeNode } from '@lexical/code'
// import { AutoLinkNode, LinkNode } from '@lexical/link'
// import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
// import { ListPlugin } from '@lexical/react/LexicalListPlugin'
// import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
// import { TRANSFORMERS } from '@lexical/markdown'

// // import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
// // import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
// // import AutoLinkPlugin from './plugins/AutoLinkPlugin'

// import { ParagraphNode } from 'lexical'
// // import { CustomParagraphNode } from './nodes/CustomParagraphNode'

// function Placeholder() {
//   return <div className='editor-placeholder'>Enter some rich text...</div>
// }
// const exampleTheme: any = {
//   ltr: 'ltr',
//   rtl: 'rtl',
//   paragraph: 'editor-paragraph',
//   quote: 'editor-quote',
//   heading: {
//     h1: 'editor-heading-h1',
//     h2: 'editor-heading-h2',
//     h3: 'editor-heading-h3',
//     h4: 'editor-heading-h4',
//     h5: 'editor-heading-h5',
//     h6: 'editor-heading-h6'
//   },
//   list: {
//     nested: {
//       listitem: 'editor-nested-listitem'
//     },
//     ol: 'editor-list-ol',
//     ul: 'editor-list-ul',
//     listitem: 'editor-listItem',
//     listitemChecked: 'editor-listItemChecked',
//     listitemUnchecked: 'editor-listItemUnchecked'
//   },
//   hashtag: 'editor-hashtag',
//   image: 'editor-image',
//   link: 'editor-link',
//   text: {
//     bold: 'editor-textBold',
//     code: 'editor-textCode',
//     italic: 'editor-textItalic',
//     strikethrough: 'editor-textStrikethrough',
//     subscript: 'editor-textSubscript',
//     superscript: 'editor-textSuperscript',
//     underline: 'editor-textUnderline',
//     underlineStrikethrough: 'editor-textUnderlineStrikethrough'
//   },
//   code: 'editor-code',
//   codeHighlight: {
//     atrule: 'editor-tokenAttr',
//     attr: 'editor-tokenAttr',
//     boolean: 'editor-tokenProperty',
//     builtin: 'editor-tokenSelector',
//     cdata: 'editor-tokenComment',
//     char: 'editor-tokenSelector',
//     class: 'editor-tokenFunction',
//     'class-name': 'editor-tokenFunction',
//     comment: 'editor-tokenComment',
//     constant: 'editor-tokenProperty',
//     deleted: 'editor-tokenProperty',
//     doctype: 'editor-tokenComment',
//     entity: 'editor-tokenOperator',
//     function: 'editor-tokenFunction',
//     important: 'editor-tokenVariable',
//     inserted: 'editor-tokenSelector',
//     keyword: 'editor-tokenAttr',
//     namespace: 'editor-tokenVariable',
//     number: 'editor-tokenProperty',
//     operator: 'editor-tokenOperator',
//     prolog: 'editor-tokenComment',
//     property: 'editor-tokenProperty',
//     punctuation: 'editor-tokenPunctuation',
//     regex: 'editor-tokenVariable',
//     selector: 'editor-tokenSelector',
//     string: 'editor-tokenSelector',
//     symbol: 'editor-tokenProperty',
//     tag: 'editor-tokenProperty',
//     url: 'editor-tokenOperator',
//     variable: 'editor-tokenVariable'
//   }
// }
// const editorConfig: any = {
//   // The editor theme
//   theme: exampleTheme,
//   // Handling of errors during update
//   onError(error: any) {
//     throw error
//   },
//   // Any custom nodes go here
//   nodes: [
//     HeadingNode,
//     ListNode,
//     ListItemNode,
//     QuoteNode,
//     CodeNode,
//     CodeHighlightNode,
//     TableNode,
//     TableCellNode,
//     TableRowNode,
//     AutoLinkNode,
//     LinkNode
//     // CustomParagraphNode,
//     // {
//     //   replace: ParagraphNode,
//     //   with: node => {
//     //     return new CustomParagraphNode()
//     //   }
//     // }
//   ]
// }

// export default function Editor() {
//   return (
//     <LexicalComposer initialConfig={editorConfig}>
//       {/* <div className='editor-container'> */}
//         {/* <ToolbarPlugin /> */}
//         {/* <div className='editor-inner'> */}
//           <RichTextPlugin
//             contentEditable={<ContentEditable className='editor-input' />}
//             placeholder={<Placeholder />}
//             ErrorBoundary={LexicalErrorBoundary}
//           />
//           <HistoryPlugin />
//           {/* <TreeViewPlugin /> */}
//           <AutoFocusPlugin />
//           {/* <CodeHighlightPlugin /> */}
//           <ListPlugin />
//           <LinkPlugin />
//           {/* <AutoLinkPlugin /> */}
//           {/* <ListMaxIndentLevelPlugin maxDepth={7} /> */}
//           <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
//         {/* </div> */}
//       {/* </div> */}
//     </LexicalComposer>
//   )
// }
// // https://lexical.dev/docs/collaboration/react
