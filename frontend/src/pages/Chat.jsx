import { useEffect, useRef, useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    IconButton,
    keyframes,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Skeleton from '@mui/material/Skeleton';
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend, IoMdTrash } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import {
    deleteUserChats,
    getUserChats,
    sendChatRequest,
} from '../helpers/api-communicator';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getGreetingMessage } from '../helpers/greetings';
import PageWrapper from '../components/PageWrapper';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const colorCycle = {
    animate: {
        color: ['#FFFFFF', '#D6DEE7', '#B8BFC6', '#B1BED1', '#64748B', '#F8FBFE'],
        transition: { duration: 2, repeat: Infinity, ease: 'linear' },
    },
};

const Chat = () => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const auth = useAuth();
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [typingMessage, setTypingMessage] = useState(null);
    const [typingIndex, setTypingIndex] = useState(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isLoading, typingIndex]);

    const handleSubmit = async () => {
        const content = inputRef.current?.value.trim();
        if (!content) {
            toast.error('Please enter a message');
            return;
        }

        if (inputRef.current) inputRef.current.value = '';

        const newMessage = { role: 'user', content };
        setChatMessages((prev) => [...prev, newMessage]);
        setIsLoading(true);

        try {
            const chatData = await sendChatRequest(content);
            if (chatData && chatData.chats) {
                setChatMessages([...chatData.chats]);
                setIsLoading(false);
            } else if (chatData && chatData.message) {
                const assistantMessage = { role: 'assistant', content: chatData.message };
                setTypingMessage(assistantMessage);
                setTypingIndex(0);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message');
            setIsLoading(false);
        }
    };

    const handleDeleteChats = async () => {
        try {
            toast.loading('Deleting Chats', { id: 'deletechats' });
            await deleteUserChats();
            setChatMessages([]);
            toast.success('Deleted Chats Successfully', { id: 'deletechats' });
        } catch (error) {
            console.error(error);
            toast.error('Deleting chats failed', { id: 'deletechats' });
        }
    };

    useEffect(() => {
        if (auth?.isLoggedIn && auth.user) {
            toast.loading('Loading Chats', { id: 'loadchats' });
            getUserChats()
                .then((data) => {
                    if (data && data.chats) {
                        setChatMessages([...data.chats]);
                        toast.success('Successfully loaded chats', { id: 'loadchats' });
                    } else {
                        toast.error('No chat history found', { id: 'loadchats' });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    toast.error('Loading Failed', { id: 'loadchats' });
                });
        }
    }, [auth]);

    useEffect(() => {
        if (!auth?.user) navigate('/login');
    }, [auth, navigate]);
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    useEffect(() => {
        if (typingMessage && typingMessage.content) {
            if (typingIndex < typingMessage.content.length) {
                const timeout = setTimeout(() => {
                    setTypingIndex((prev) => prev + 1);
                }, 30);

                return () => clearTimeout(timeout);
            } else {
                setChatMessages((prev) => [...prev, typingMessage]);
                setTypingMessage(null);
                setTypingIndex(0);
                setIsLoading(false);
            }
        }
    }, [typingIndex, typingMessage]);

    return (
        <PageWrapper>
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                    maxWidth: '70vw',
                    minWidth: '30rem',
                    minHeight: '80vh',
                    alignItems: 'center',
                    gap: { xs: 2, sm: 3 },
                    flexDirection: { xs: 'column', md: 'row' },
                    margin: '0 auto',
                    backgroundColor: '#9AA6B2',
                    borderRadius: '25px',
                    padding: { xs: 2, sm: 3 },
                    boxSizing: 'border-box',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flex: 3,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        borderRadius: '10px',
                        padding: { xs: 1, sm: 2 },
                        height: { xs: 'auto', md: '80vh' },
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            borderRadius: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '50vw',
                            width: '100%',

                            overflow: 'auto',
                            bgcolor: '#F8FAFC',
                            mb: 1,
                            maxHeight: { xs: '60vh', md: '80vh' },
                        }}
                    >
                        {chatMessages.length === 0 && !isLoading && !typingMessage ? (
                            <Typography sx={{
                                textAlign: 'center',
                                color: '#999',
                                mt: { xs: '10%', sm: '15%', md: '20%' },
                                px: { xs: 1, sm: 2 },
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }
                            }}>
                                {auth?.user?.name
                                    ? getGreetingMessage(auth.user.name)
                                    : 'Welcome to DERM-AI! 👋'}
                            </Typography>
                        ) : (
                            <>
                                {chatMessages.map((chat, index) => (
                                    <ChatItem content={chat.content} role={chat.role} key={index} />
                                ))}

                                {typingMessage && (
                                    <ChatItem
                                        content={typingMessage.content.substring(0, typingIndex)}
                                        role={typingMessage.role}
                                        isTyping
                                    />
                                )}

                                {isLoading && !typingMessage && (
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: { xs: 1, sm: 2 },
                                        gap: { xs: 1, sm: 2 }
                                    }}>
                                        <Skeleton
                                            height="10em"
                                            width="80%"
                                            style={{ marginBottom: 6, borderRadius: "25px" }}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{
                        width: '100%',
                        borderRadius: '20px',
                        backgroundColor: '#E5E1DA',
                        display: 'flex',
                        alignItems: 'center',
                        padding: { xs: '3px 8px', sm: '5px 10px' },
                        gap: { xs: 1, sm: 2 }
                    }}>
                        <input
                            ref={inputRef}
                            type='text'
                            placeholder='Start typing...'
                            style={{
                                flex: 1,
                                height: '2rem',
                                backgroundColor: '#F1F0E8',
                                padding: { xs: '8px', sm: '10px' },
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: { xs: '14px', sm: '16px' },
                                outline: 'none'
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                        <IconButton
                            onClick={handleSubmit}
                            sx={{
                                color: 'white',
                                backgroundColor: '#7E60BF',
                                padding: { xs: '8px', sm: '10px' },
                                '&:hover': { backgroundColor: '#654A99' }
                            }}
                        >
                            <IoMdSend size={20} />
                        </IconButton>
                        <IconButton
                            onClick={handleDeleteChats}
                            sx={{
                                color: 'white',
                                backgroundColor: '#E74C3C',
                                padding: { xs: '8px', sm: '10px' },
                                '&:hover': { backgroundColor: '#C0392B' }
                            }}
                        >
                            <IoMdTrash size={20} />
                        </IconButton>
                    </Box>

                </Box>
            </Box>
        </PageWrapper>
    );
};

export default Chat;