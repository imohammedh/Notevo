import imgSrc_TalkNote from "../public/chat_Note.png"
import imgSrc_Categorization from "../public/data-classification_note.png"
import imgSrc_TextEditor from "../public/content-creator_note.png"
import imgSrc_Sync from "../public/sync_note.png"
export const NavLinks = [
    {
        Name:"Home",
        path:"/",
        clicked:true,
    },
    {
        Name:"Features",
        path:"/#features",
        clicked:false,
    },
    {
        Name:"How To Start",
        path:"/#How_To_Start",
        clicked:false,
    },
    {
        Name:"Testimonials",
        path:"/#testimonials",
        clicked:false,
    },
] as const

export const HowToStartSteps =[
    {
        id:"1",
        StepNum:"Step 1",
        Title:"Sign up for an account ",
        Body:"it's free for now ✨"
    },
    {
        id:"2",
        StepNum:"Step 2",
        Title:"Start write your note's ",
        Body:"after you sign up you will be redirect to your dashboard "
    },
    {
        id:"3",
        StepNum:"Step 3",
        Title:"Start asking your note ",
        Body:"if you want to remember what you were writing you can ask your note "
    },
]as const 

export const features = [
    {
        id:"1",
        Title:"Talk to Your Notes",
        Body:"Our advanced AI allows you to interact with your notes naturally. Ask questions, get summaries, and explore insights seamlessly.",
        imgSrc:imgSrc_TalkNote,
        isReverse:false
    },
    {
        id:"2",
        Title:"Smart Categorization and Tagging",
        Body:"Automatically organize your notes with smart tags and categories, making it easy to find what you need when you need it.",
        imgSrc:imgSrc_Categorization,
        isReverse:true
    },
    {
        id:"3",
        Title:"Rich Text Editor",
        Body:"Create and edit notes with a Notion-style WYSIWYG editor, powered by Novel. Enjoy AI-powered autocompletion and rich text formatting.",
        imgSrc:imgSrc_TextEditor,
        isReverse:false
    },
    {
        id:"4",
        Title:"Sync Across Devices",
        Body:"Access your notes from anywhere with seamless syncing across all your devices.",
        imgSrc:imgSrc_Sync,
        isReverse:true
    },
] as const 

export const testimonials =[
    {
        id:"1",
        Title:"John Smith",
        Body:"NoteWise has completely transformed the way I take and manage notes. The AI interaction feature is a game-changer, making it easy to organize and retrieve information quickly.",
        Color:"brand_secondary",
    },
    {
        id:"2",
        Title:"Sarah Johnson",
        Body:"As a student, NoteWise has helped me keep my notes organized and easily accessible. The smart search capability is incredibly useful during exam time!",
        Color:"brand_secondary",
    },
    {
        id:"3",
        Title:"Michael Brown",
        Body:"NoteWise's real-time collaboration feature has streamlined our team's workflow. We can all contribute to and edit notes simultaneously, which is a huge productivity boost.",
        Color:"brand_secondary",
    },
    {
        id:"4",
        Title:"Emily Davis",
        Body:"I love how intuitive and user-friendly NoteWise is. The AI suggestions for organizing my notes have saved me so much time.",
        Color:"brand_secondary",
    },
    {
        id:"5",
        Title:"Jessica Wilson",
        Body:"NoteWise has become an indispensable tool for my research projects. The ability to interact with my notes and get relevant insights is amazing.",
        Color:"brand_secondary",
    },
    {
        id:"6",
        Title:"David Martinez",
        Body:"As a writer, NoteWise helps me keep track of my ideas and drafts. The AI-powered organization keeps everything neat and easy to find.",
        Color:"brand_secondary",
    }, 
    {
        id:"7",
        Title:"Linda Thompson",
        Body:"NoteWise is perfect for managing my daily tasks and to-do lists. The interactive features make it so much more than just a note-taking app.",
        Color:"brand_secondary",
    },
    {
        id:"8",
        Title:"James Anderson",
        Body: "I've tried many note-taking apps, but NoteWise stands out with its AI capabilities. It feels like having a personal assistant for my notes.",
        Color:"brand_secondary",
    },
    {
        id:"9",
        Title:"Robert Lee",
        Body:"NoteWise has enhanced my productivity by allowing me to interact with my notes. It's the smartest way to keep track of information and ideas.",
        Color:"brand_secondary",
    },
    {
        id:"10",
        Title:"Maria Rodriguez",
        Body:"NoteWise's clean interface and powerful features make it a joy to use. I can't imagine going back to traditional note-taking methods.",
        Color:"brand_secondary",
    },
    
] as const 