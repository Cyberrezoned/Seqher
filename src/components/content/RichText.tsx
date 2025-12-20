"use client";

import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

interface RichTextProps {
  content: string;
  className?: string;
}

const RichText = ({ content, className }: RichTextProps) => {
  const [sanitizedContent, setSanitizedContent] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSanitizedContent(DOMPurify.sanitize(content));
    }
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichText;