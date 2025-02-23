import imgSrc_TalkNote from "../public/chat_Note.png"
import imgSrc_Categorization from "../public/data-classification_note.png"
import imgSrc_TextEditor from "../public/content-creator_note.png"
import imgSrc_Sync from "../public/sync_note.png"
import { IoLogoVercel } from "react-icons/io5";
import { BsStars } from "react-icons/bs";

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
        StepNum:"1",
        Title:"Sign Up & Get Started",
        Body:"Sign up effortlessly using OAuth or Magic Links no passwords required!."
    },
    {
        id:"2",
        StepNum:"2",
        Title:"Create Your Workspace",
        Body:"Whether you're working solo or collaborating with a team, setting up a workspace is simple."
    },
    {
        id:"3",
        StepNum:"3",
        Title:"Start Writing & Unlock AI Power",
        Body:"Write, ask questions, and let AI supercharge your creativity."
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

export const poweredBy =[
  {
    icon:BsStars,
    brannedName:"Novel"
  },
  {
    icon:IoLogoVercel,
    brannedName:"Vercel AI SDK"
  },
] as const 

export const testimonials1 = [
  {
    quote:
      "Notevo has completely transformed the way I take and manage notes. The AI interaction feature is a game-changer, making it easy to organize and retrieve information quickly.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "As a student, Notevo has helped me keep my notes organized and easily accessible. The smart search capability is incredibly useful during exam time!",
    name: "William Shakespeare",
    title: "Hamlet",
  },
]as const;
export const testimonials2 = [
  {
    quote:
      "I love how intuitive and user-friendly Notevo is. The AI suggestions for organizing my notes have saved me so much time.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Notevo has become an indispensable tool for my research projects. The ability to interact with my notes and get relevant insights is amazing.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
  {
    quote: "Notevo's real-time collaboration feature has streamlined our team's workflow. We can all contribute to and edit notes simultaneously, which is a huge productivity boost.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
]as const;