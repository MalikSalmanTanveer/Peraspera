"use client";

import { useState, useEffect } from "react";

interface TypewriterHeadingProps {
  words: string[];
}

export default function TypewriterHeading({ words }: TypewriterHeadingProps) {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const word = words[currentWordIdx];
    
    // Configure typing speed parameters
    const typingSpeed = isDeleting ? 40 : 80;
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        const nextText = word.substring(0, currentText.length + 1);
        setCurrentText(nextText);
        
        if (nextText === word) {
          // Pause at full word before starting to delete
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        // Deleting backward
        const nextText = currentText.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        
        if (nextText === "") {
          setIsDeleting(false);
          // Cycle to the next word
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
          return;
        }
      }
      
      timer = setTimeout(handleTyping, typingSpeed);
    };

    timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIdx, words]);

  return (
    <span style={{ color: "var(--primary)", fontStyle: "italic", position: "relative", display: "inline-block" }}>
      {currentText}
      <span className="typewriter-cursor" />
    </span>
  );
}
