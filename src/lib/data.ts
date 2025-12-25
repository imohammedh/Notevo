import imgSrc_TalkNote from "../public/chat_Note.png";
import imgSrc_Categorization from "../public/data-classification_note.png";
import imgSrc_TextEditor from "../public/content-creator_note.png";
import imgSrc_Sync from "../public/sync_note.png";
import { IoLogoVercel } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { Brain, Cloud, FileText, LayoutGrid, Activity } from "lucide-react";

export const NavLinks = [
  {
    Name: "Home",
    path: "/",
    clicked: true,
  },
  {
    Name: "Features",
    path: "/#features",
    clicked: false,
  },
  {
    Name: "About",
    path: "/#about",
    clicked: false,
  },
  // {
  //     Name:"Pricing",
  //     path:"/#pricing",
  //     clicked:false,
  // },
] as const;

export const HowToStartSteps = [
  {
    id: "1",
    StepNum: "1",
    Title: "Sign Up & Get Started",
    Body: "Sign up effortlessly using OAuth or Magic Links no passwords required!.",
  },
  {
    id: "2",
    StepNum: "2",
    Title: "Create Your Workspace",
    Body: "setting up you'r workspace",
  },
  {
    id: "3",
    StepNum: "3",
    Title: "Start Writing",
    Body: "Writing and experience the power of Simple, Structured Note-Taking.",
  },
] as const;

export const poweredBy = [
  {
    icon: BsStars,
    brannedName: "Novel",
  },
  {
    icon: IoLogoVercel,
    brannedName: "Vercel AI SDK",
  },
] as const;

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
] as const;
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
    quote:
      "Notevo's real-time collaboration feature has streamlined our team's workflow. We can all contribute to and edit notes simultaneously, which is a huge productivity boost.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
] as const;

export const pricingPlans = {
  free: {
    name: "Free",
    description: "Perfect for getting started with basic features",
    price: 0,
    features: [
      { name: "Up to 1 workspace", included: true },
      { name: "Up to 2 Tables", included: true },
      { name: "Basic note editor", included: true },
      { name: "20 notes", included: true },
      { name: "Unlimited workspaces", included: false },
      { name: "Unlimited notes", included: false },
      { name: "Priority support", included: false },
    ],
  },
  pro: {
    name: "Pro",
    description: "Everything you need for unlimited productivity",
    price: 6,
    features: [
      { name: "Unlimited workspaces", included: true },
      { name: "Unlimited Tables", included: true },
      { name: "Advanced note editor", included: true },
      { name: "Unlimited notes", included: true },
      { name: "Custom templates", included: true },
      { name: "Collaboration features", included: true },
      { name: "Priority support", included: true },
    ],
  },
};

export const Features = [
  {
    title: "Rich Text Editor",
    description:
      "Create and edit notes with a Notion-style WYSIWYG editor, powered by Novel.rich text formatting.",
    icon: FileText,
  },
  {
    title: "Simple Organization",
    description:
      "Organize your thoughts, manage your workspaces, and boost your productivity with Notevo's intuitive organization system.",
    icon: LayoutGrid,
  },
] as const;
