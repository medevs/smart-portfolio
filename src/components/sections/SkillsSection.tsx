"use client";

import { useState, useEffect } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import CommandPrompt from "@/components/terminal/CommandPrompt";

const skillCategories = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Astro"],
  backend: ["Node.js", "Express", "PHP", "Laravel", "Python"],
  database: ["MySQL", "MongoDB", "Prisma", "Supabase"],
  ai_ml: ["LangChain", "OpenAI", "RAG", "Embeddings"],
  tools: ["Git", "Docker", "VS Code", "Jest", "CI/CD"],
};

export default function SkillsSection() {
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "cat skills.json | jq";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let index = 0;
          const typingInterval = setInterval(() => {
            if (index <= fullText.length) {
              setTypedText(fullText.slice(0, index));
              index++;
            } else {
              clearInterval(typingInterval);
              setTimeout(() => setShowContent(true), 300);
            }
          }, 60);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById("skills-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills-section" className="py-8 px-4">
      <TerminalWindow title="skills.json" className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {/* Command */}
          <CommandPrompt>
            <span>{typedText}</span>
            {!showContent && typedText.length > 0 && typedText.length < fullText.length && (
              <span className="inline-block w-2 h-4 ml-0.5 bg-terminal-green animate-cursor-blink" />
            )}
          </CommandPrompt>

          {/* Output - JSON style */}
          {showContent && (
            <div className="animate-fade-in">
              <pre className="text-sm overflow-x-auto">
                <code>
                  <span className="text-terminal-muted">{"{"}</span>
                  {"\n"}
                  {Object.entries(skillCategories).map(([category, skills], catIndex, catArray) => (
                    <span key={category}>
                      {"  "}
                      <span className="text-terminal-cyan">&quot;{category}&quot;</span>
                      <span className="text-terminal-muted">: [</span>
                      {"\n"}
                      {skills.map((skill, skillIndex) => (
                        <span key={skill}>
                          {"    "}
                          <span className="text-terminal-green">&quot;{skill}&quot;</span>
                          {skillIndex < skills.length - 1 && (
                            <span className="text-terminal-muted">,</span>
                          )}
                          {"\n"}
                        </span>
                      ))}
                      {"  "}
                      <span className="text-terminal-muted">]</span>
                      {catIndex < catArray.length - 1 && (
                        <span className="text-terminal-muted">,</span>
                      )}
                      {"\n"}
                    </span>
                  ))}
                  <span className="text-terminal-muted">{"}"}</span>
                </code>
              </pre>
            </div>
          )}
        </div>
      </TerminalWindow>
    </section>
  );
}
