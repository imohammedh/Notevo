import React, { useState } from "react";
import { JSONContent } from "@tiptap/react";
import TailwindAdvancedEditor from "@/components/advanced-editor";

interface Tab {
  id: number;
  title: string;
  url: string;
  content: JSONContent;
}

const BrowserMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [content, setContent] = useState<JSONContent>({
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "! Hi 👋 " }],
      },
      {
        type: "codeBlock",
        attrs: { language: "typescriptreact" },
        content: [
          { type: "text", text: "Write something or Press '/' for commands" },
        ],
      },
      {
        type: "youtube",
        attrs: {
          src: "https://youtu.be/b1t41Q3xRM8?si=aJoJVBkEWaqSCDOZ",
          start: 0,
          width: 640,
          height: 480,
        },
      },
    ],
  });

  const tabs: Tab[] = [
    {
      id: 1,
      title: "Try out our rich text editor !",
      url: "https://notevo.me/",
      content: content,
    },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className="w-full max-w-5xl">
      {/* Responsive Browser Container */}
      <div
        className="
          relative
          w-full
          aspect-[16/11] 
          max-w-[90vw] 
          sm:max-w-3xl 
          Desktop:max-w-4xl
          overflow-hidden
          rounded-lg
          shadow-2xl
          border border-border
        "
      >
        {/* Browser Frame - Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-10">
          {/* Toolbar with Tabs */}
          <div className="bg-muted border-b border-border h-11 flex items-stretch">
            {/* Mac Dots */}
            <div className="pl-3 pr-2 pt-3 flex-none flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>

            {/* Tabs */}
            <div className="flex items-end space-x-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2 text-xs sm:text-sm cursor-pointer rounded-t-md transition
                    border-x border-t border-border
                    ${
                      activeTab === tab.id
                        ? "bg-background text-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted-foreground/80"
                    }
                  `}
                >
                  {tab.title}
                </div>
              ))}
            </div>
          </div>

          {/* Address Bar */}
          <div className="bg-muted border-b border-border px-3 py-2 flex items-center gap-3">
            {/* Navigation Arrows */}
            <div className="flex gap-2 text-muted-foreground">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* URL Bar */}
            <div className="flex-1 bg-background/80 backdrop-blur rounded-md px-4 py-1.5 text-xs sm:text-sm text-muted-foreground border border-border">
              {currentTab.url}
            </div>

            {/* Right Icons */}
            <div className="flex gap-3 text-muted-foreground">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5.5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Page Content Area */}
        <div className="h-full pt-24 pb-6 px-4 sm:px-6 lg:px-8 bg-background rounded-b-lg overflow-y-auto">
          <TailwindAdvancedEditor
            initialContent={currentTab.content}
            onUpdate={(editor) => {
              const updatedContent = editor.getJSON();
              setContent(updatedContent);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BrowserMockup;
