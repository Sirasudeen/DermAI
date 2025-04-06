export const getGreetingMessage = (username) => {
    const greetings = [
        `Hello, ${username}! Ready to chat?`,
        `Hey there, ${username}! What's on your mind today?`,
        `Greetings, ${username}! How can I assist you today?`,
        `Hi, ${username}! Let's make your day better.`,
        `Welcome back, ${username}! How can I help you today?`,
        `Good day, ${username}! Let's get started.`,
    ];

    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
};
