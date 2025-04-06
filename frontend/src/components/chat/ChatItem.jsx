import React from "react";
import { Box, Avatar, Typography, keyframes } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";


function extractCodeFromString(message) {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    const blocks = [];
    let lastIndex = 0;

    while ((match = regex.exec(message)) !== null) {
        const [, language, code] = match;
        const index = match.index;

        if (lastIndex < index) {
            blocks.push({
                text: message.substring(lastIndex, index),
                isCode: false,
            });
        }

        blocks.push({
            code: code.trim(),
            language: language || "javascript",
            isCode: true,
        });

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < message.length) {
        blocks.push({
            text: message.substring(lastIndex),
            isCode: false,
        });
    }

    return blocks;
}

const blinkCursor = keyframes`
  from { border-right-color: rgba(0, 0, 0, 0.75); }
  to { border-right-color: transparent; }
`;


const ChatItem = ({ content, role, isTyping = false }) => {
    const messageBlocks = extractCodeFromString(content);

    const containerVariants = {
        hidden: { opacity: 0, x: role === "user" ? 50 : -50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            transition={{ duration: 0.5 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        p: 2,
                        m: 3,
                        justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
                        bgcolor: role === "assistant" ? "#FFFFFF" : "#E7CCCC",
                        gap: 2,
                        borderRadius: role === "assistant" ? 2 : "20px",
                        my: 1,
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
                        alignItems: "flex-start",
                    }}
                >

                    <Box>
                        {messageBlocks.map((block, index) =>
                            block.isCode ? (
                                <SyntaxHighlighter
                                    key={index}
                                    style={coldarkDark}
                                    language={block.language}
                                    wrapLongLines
                                    customStyle={{
                                        borderRadius: "8px",
                                        padding: "10px",
                                        fontSize: "14px",
                                        backgroundColor: "#2D2D2D",
                                    }}
                                >
                                    {block.code}
                                </SyntaxHighlighter>
                            ) : (
                                <Typography
                                    key={index}
                                    sx={{
                                        fontSize: "16px",
                                        color: role === "assistant" ? "#0B192C" : "#433878",
                                        mb: block.text.endsWith("\n") ? 1 : 0,
                                        whiteSpace: "pre-wrap",
                                        display: "inline",
                                        borderRight: isTyping ? "2px solid rgba(0,0,0,0.75)" : "none",
                                        animation: isTyping
                                            ? `${blinkCursor} 0.7s steps(44) infinite normal`
                                            : "none",
                                    }}
                                >
                                    {block.text}
                                </Typography>
                            )
                        )}
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

export default ChatItem;
