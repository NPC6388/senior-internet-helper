class SeniorAI {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.voiceButton = document.getElementById('voice-button');
        this.helpButtons = document.querySelectorAll('.help-btn');
        
        this.isListening = false;
        this.recognition = null;
        
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        this.helpButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                this.handleQuickHelp(topic);
            });
        });
        
        this.voiceButton.addEventListener('click', () => this.toggleVoiceRecognition());
        
        this.setupVoiceRecognition();
    }
    
    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.userInput.value = transcript;
                this.sendMessage();
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                this.voiceButton.textContent = '🎤';
                this.voiceButton.style.backgroundColor = '#66bb6a';
            };
        } else {
            this.voiceButton.style.display = 'none';
        }
    }
    
    toggleVoiceRecognition() {
        if (!this.recognition) return;
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
            this.isListening = true;
            this.voiceButton.textContent = '🔴';
            this.voiceButton.style.backgroundColor = '#f44336';
        }
    }
    
    sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        this.userInput.value = '';
        
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'ai');
        }, 500);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = text;
        
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check if this is a search-like query (questions about facts, weather, etc.)
        if (this.isSearchQuery(message)) {
            return this.handleSearchQuery(userMessage);
        }
        
        // Check if this is a how-to question
        if (this.isHowToQuery(message)) {
            return this.handleHowToQuery(message);
        }
        
        // Email safety responses
        if (message.includes('email') || message.includes('spam') || message.includes('phishing')) {
            return `
                <strong>Email Safety Tips:</strong>
                <ul>
                    <li>Never click links in emails from unknown senders</li>
                    <li>Don't download attachments unless you're expecting them</li>
                    <li>Be suspicious of emails asking for personal information</li>
                    <li>Check the sender's email address carefully - scammers often use fake addresses</li>
                    <li>When in doubt, delete the email or ask a trusted family member</li>
                </ul>
                Remember: Legitimate companies will never ask for passwords via email!
            `;
        }
        
        // Shopping safety
        if (message.includes('shop') || message.includes('buy') || message.includes('purchase')) {
            return `
                <strong>Safe Online Shopping Tips:</strong>
                <ul>
                    <li>Only shop on websites that start with "https://" (look for the lock icon)</li>
                    <li>Use well-known retailers like Amazon, Target, or official brand websites</li>
                    <li>Never save your credit card information on websites</li>
                    <li>Check reviews before buying from new websites</li>
                    <li>Be wary of deals that seem too good to be true</li>
                    <li>Use PayPal when possible for extra protection</li>
                </ul>
                Always double-check the website address before entering payment information!
            `;
        }
        
        // Social media help
        if (message.includes('facebook') || message.includes('social') || message.includes('instagram')) {
            return `
                <strong>Social Media Safety:</strong>
                <ul>
                    <li>Keep your profile private - only accept friend requests from people you know</li>
                    <li>Never share personal information like your address or phone number</li>
                    <li>Be careful about posting when you're away from home</li>
                    <li>Don't click on suspicious links, even from friends (their account might be hacked)</li>
                    <li>Report and block anyone who makes you uncomfortable</li>
                </ul>
                Remember: What you post online stays there forever, so think before you share!
            `;
        }
        
        // Video calling help
        if (message.includes('video') || message.includes('call') || message.includes('zoom') || message.includes('skype')) {
            return `
                <strong>Video Calling Made Easy:</strong>
                <ul>
                    <li><strong>Popular apps:</strong> Zoom, Skype, WhatsApp, FaceTime (iPhone/iPad)</li>
                    <li>Make sure you have good lighting (face a window if possible)</li>
                    <li>Test your camera and microphone before important calls</li>
                    <li>Keep calls with strangers short and never share personal information</li>
                    <li>Learn how to mute/unmute yourself (usually spacebar or mute button)</li>
                </ul>
                Ask a family member to help you set up your first video call - they'll love to help!
            `;
        }
        
        // Password help
        if (message.includes('password') || message.includes('login') || message.includes('account')) {
            return `
                <strong>Password Security:</strong>
                <ul>
                    <li>Use a different password for each important account</li>
                    <li>Make passwords at least 12 characters long</li>
                    <li>Include uppercase, lowercase, numbers, and symbols</li>
                    <li>Use phrases you'll remember: "MyDog#Fluffy2024!"</li>
                    <li>Never share passwords with anyone</li>
                    <li>Consider using your browser's built-in password manager</li>
                </ul>
                Write down important passwords and keep them in a safe place at home!
            `;
        }
        
        // Scam prevention
        if (message.includes('scam') || message.includes('fraud') || message.includes('suspicious')) {
            return `
                <strong>How to Avoid Scams:</strong>
                <ul>
                    <li>If someone contacts you unexpectedly asking for money or information, it's likely a scam</li>
                    <li>Government agencies don't call threatening arrest - they send letters</li>
                    <li>Your bank will never ask for your PIN or full password</li>
                    <li>Be suspicious of "urgent" requests or "limited time offers"</li>
                    <li>Never give remote access to your computer to strangers</li>
                    <li>When in doubt, hang up and call the official number yourself</li>
                </ul>
                Trust your instincts - if something feels wrong, it probably is!
            `;
        }
        
        // Internet basics
        if (message.includes('internet basics') || message.includes('what is internet') || message.includes('how does internet work')) {
            return `
                <strong>Internet Basics - Simple Explanation:</strong>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">📡</span>
                        <span class="step-text"><strong>What is the Internet?</strong> It's like a giant library where computers all over the world share information</span>
                    </div>
                    <div class="step">
                        <span class="step-number">🌐</span>
                        <span class="step-text"><strong>Websites:</strong> Like books in the library - each has an address (like google.com)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">🔍</span>
                        <span class="step-text"><strong>Web Browser:</strong> Your "vehicle" for visiting websites (Chrome, Firefox, Safari, Edge)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">🔗</span>
                        <span class="step-text"><strong>Links:</strong> Blue underlined text you can click to go to other pages</span>
                    </div>
                    <div class="step">
                        <span class="step-number">📧</span>
                        <span class="step-text"><strong>Email:</strong> Like sending letters, but instant and electronic</span>
                    </div>
                </div>
                💡 <strong>Remember:</strong> The internet is just a tool - like a telephone or television!
            `;
        }
        
        // General greetings and help
        if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
            return `
                Hello! I'm here to help you navigate the internet safely and easily. I can help you with:
                <ul>
                    <li><strong>Searching the web</strong> - Ask me "What's the weather?" or "How do I find recipes?"</li>
                    <li><strong>Step-by-step guides</strong> - "How do I email photos?" or "How do I video call?"</li>
                    <li><strong>Internet safety</strong> - Learning to avoid scams and stay secure</li>
                    <li><strong>Computer basics</strong> - Understanding how to use your computer and the internet</li>
                    <li><strong>Simple explanations</strong> - I'll explain things in easy-to-understand language</li>
                </ul>
                What would you like to learn about today? You can ask me a question or click one of the quick help buttons below!
            `;
        }
        
        // Default response
        return `
            I understand you're asking about "${userMessage}". While I may not have specific information about that topic, here are some general internet safety tips:
            <ul>
                <li>Always be cautious when sharing personal information online</li>
                <li>If something seems suspicious, ask a trusted family member for help</li>
                <li>Take your time - there's no need to rush when using the internet</li>
                <li>Keep your devices updated with the latest security patches</li>
            </ul>
            Try asking about email safety, online shopping, social media, video calls, passwords, or scam prevention!
        `;
    }
    
    handleQuickHelp(topic) {
        const topics = {
            'how-to-email-photos': 'How do I email photos?',
            'how-to-video-call': 'How do I make a video call?',
            'online-shopping': 'How do I shop online safely?',
            'weather-search': 'What\'s the weather today?',
            'find-recipes': 'How do I find recipes online?',
            'scam-prevention': 'How do I avoid scams?',
            'basic-computer': 'How do I use a computer?',
            'internet-basics': 'What are internet basics?'
        };
        
        const question = topics[topic] || 'Can you help me?';
        this.addMessage(question, 'user');
        
        setTimeout(() => {
            const response = this.generateResponse(question);
            this.addMessage(response, 'ai');
        }, 500);
    }
    
    isSearchQuery(message) {
        const searchIndicators = [
            'what is', 'what are', 'what\'s', 'whats',
            'how much', 'how many', 'how old',
            'when is', 'when was', 'when did',
            'where is', 'where are', 'where can',
            'who is', 'who are', 'who was',
            'weather', 'temperature', 'forecast',
            'news', 'current events',
            'define', 'meaning of',
            'price of', 'cost of',
            'recipe for', 'how to cook', 'how to bake',
            'directions to', 'how to get to',
            'phone number for', 'address of',
            'hours for', 'when does', 'when is open'
        ];
        
        return searchIndicators.some(indicator => message.includes(indicator));
    }
    
    isHowToQuery(message) {
        const howToIndicators = [
            'how do i', 'how can i', 'how to',
            'show me how', 'teach me',
            'step by step', 'guide me',
            'walk me through', 'help me',
            'instructions for', 'tutorial'
        ];
        
        return howToIndicators.some(indicator => message.includes(indicator));
    }
    
    handleSearchQuery(query) {
        // Common search responses with simple, helpful information
        const message = query.toLowerCase();
        
        if (message.includes('weather')) {
            return `
                <strong>To check the weather:</strong>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">1.</span>
                        <span class="step-text">Go to <strong>weather.com</strong> or <strong>weather.gov</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">2.</span>
                        <span class="step-text">Type your city name in the search box</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3.</span>
                        <span class="step-text">Press Enter or click the search button</span>
                    </div>
                    <div class="step">
                        <span class="step-number">4.</span>
                        <span class="step-text">You'll see today's weather and the forecast for the week</span>
                    </div>
                </div>
                💡 <strong>Tip:</strong> You can also ask Siri, Alexa, or Google Assistant "What's the weather today?"
            `;
        }
        
        if (message.includes('recipe') || message.includes('cook') || message.includes('bake')) {
            return `
                <strong>To find recipes online:</strong>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">1.</span>
                        <span class="step-text">Go to <strong>allrecipes.com</strong> or <strong>foodnetwork.com</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">2.</span>
                        <span class="step-text">Type what you want to cook in the search box (like "chocolate chip cookies")</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3.</span>
                        <span class="step-text">Click on a recipe with good ratings (look for 4-5 stars)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">4.</span>
                        <span class="step-text">Read the reviews to see what other people thought</span>
                    </div>
                </div>
                💡 <strong>Tip:</strong> You can print the recipe by pressing Ctrl+P on your keyboard!
            `;
        }
        
        if (message.includes('news')) {
            return `
                <strong>To read news online safely:</strong>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">1.</span>
                        <span class="step-text">Visit trusted news sites like <strong>bbc.com</strong>, <strong>npr.org</strong>, or your local newspaper's website</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2.</span>
                        <span class="step-text">Be careful of fake news on social media</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3.</span>
                        <span class="step-text">Check multiple sources if a story seems shocking</span>
                    </div>
                </div>
                ⚠️ <strong>Warning:</strong> Avoid clicking on sensational headlines or "click-bait" articles!
            `;
        }
        
        // Generic search response
        return `
            <strong>I'd like to help you search for "${query}"</strong>
            <p>Here are some safe ways to find information online:</p>
            <div class="step-guide">
                <div class="step">
                    <span class="step-number">1.</span>
                    <span class="step-text">Go to <strong>google.com</strong> or <strong>bing.com</strong></span>
                </div>
                <div class="step">
                    <span class="step-number">2.</span>
                    <span class="step-text">Type your question in the search box</span>
                </div>
                <div class="step">
                    <span class="step-number">3.</span>
                    <span class="step-text">Look for results from trusted websites (government sites end in .gov, educational sites end in .edu)</span>
                </div>
            </div>
            💡 <strong>Tip:</strong> Be specific in your search - instead of "dogs", try "best dog breeds for seniors"
        `;
    }
    
    handleHowToQuery(query) {
        const message = query.toLowerCase();
        
        if (message.includes('email') && (message.includes('photo') || message.includes('picture') || message.includes('attach'))) {
            return `
                <strong>How to Email Photos - Step by Step:</strong>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">1.</span>
                        <span class="step-text">Open your email (Gmail, Yahoo, Outlook, etc.)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2.</span>
                        <span class="step-text">Click "Compose" or "New Email"</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3.</span>
                        <span class="step-text">Type the recipient's email address</span>
                    </div>
                    <div class="step">
                        <span class="step-number">4.</span>
                        <span class="step-text">Add a subject line like "Family Photos"</span>
                    </div>
                    <div class="step">
                        <span class="step-number">5.</span>
                        <span class="step-text">Look for a paperclip icon or "Attach" button and click it</span>
                    </div>
                    <div class="step">
                        <span class="step-number">6.</span>
                        <span class="step-text">Find your photos on your computer and select them</span>
                    </div>
                    <div class="step">
                        <span class="step-number">7.</span>
                        <span class="step-text">Wait for the photos to upload (you'll see a progress bar)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">8.</span>
                        <span class="step-text">Write your message and click "Send"</span>
                    </div>
                </div>
                💡 <strong>Tip:</strong> Large photos may take time to send. If sending many photos, consider doing a few at a time!
            `;
        }
        
        if (message.includes('video call') || message.includes('videocall') || (message.includes('call') && message.includes('video'))) {
            return `
                <strong>How to Make a Video Call - Step by Step:</strong>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">1.</span>
                        <span class="step-text"><strong>Choose an app:</strong> Zoom, Skype, WhatsApp, or FaceTime (for iPhones/iPads)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2.</span>
                        <span class="step-text">Make sure your camera and microphone are working</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3.</span>
                        <span class="step-text">Find good lighting - sit facing a window if possible</span>
                    </div>
                    <div class="step">
                        <span class="step-number">4.</span>
                        <span class="step-text">Open the app and find your contact</span>
                    </div>
                    <div class="step">
                        <span class="step-number">5.</span>
                        <span class="step-text">Click the video call button (usually a camera icon)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">6.</span>
                        <span class="step-text">Wait for them to answer</span>
                    </div>
                    <div class="step">
                        <span class="step-number">7.</span>
                        <span class="step-text">During the call: Click the microphone to mute/unmute, click the camera to turn video on/off</span>
                    </div>
                </div>
                💡 <strong>Tip:</strong> Practice with a family member first to get comfortable with the buttons!
            `;
        }
        
        if (message.includes('computer') || message.includes('basic')) {
            return `
                <strong>Computer Basics for Beginners:</strong>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">1.</span>
                        <span class="step-text"><strong>Mouse:</strong> Left-click to select, double-click to open, right-click for more options</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2.</span>
                        <span class="step-text"><strong>Keyboard shortcuts:</strong> Ctrl+C to copy, Ctrl+V to paste, Ctrl+Z to undo</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3.</span>
                        <span class="step-text"><strong>Web browser:</strong> The program you use to visit websites (Chrome, Firefox, Safari, Edge)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">4.</span>
                        <span class="step-text"><strong>Address bar:</strong> Where you type website addresses (like google.com)</span>
                    </div>
                    <div class="step">
                        <span class="step-number">5.</span>
                        <span class="step-text"><strong>Bookmarks:</strong> Save your favorite websites for easy access later</span>
                    </div>
                </div>
                💡 <strong>Remember:</strong> Take your time and don't be afraid to click around - you won't break anything!
            `;
        }
        
        // Generic how-to response
        return `
            <strong>I'd love to help you with "${query}"</strong>
            <p>While I don't have specific steps for that task, here are some general tips:</p>
            <div class="step-guide">
                <div class="step">
                    <span class="step-number">1.</span>
                    <span class="step-text">Break the task into small steps</span>
                </div>
                <div class="step">
                    <span class="step-number">2.</span>
                    <span class="step-text">Ask a family member or friend for help</span>
                </div>
                <div class="step">
                    <span class="step-number">3.</span>
                    <span class="step-text">Search online for tutorials (try "how to [your task] for beginners")</span>
                </div>
                <div class="step">
                    <span class="step-number">4.</span>
                    <span class="step-text">Take your time and practice</span>
                </div>
            </div>
            Try asking me about emailing photos, video calling, or computer basics!
        `;
    }
}

// Text-to-speech functionality
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        speechSynthesis.speak(utterance);
    }
}

// Add click-to-speak functionality to AI messages
document.addEventListener('click', (e) => {
    if (e.target.closest('.ai-message')) {
        const messageText = e.target.closest('.ai-message').querySelector('.message-content').textContent;
        speakText(messageText);
    }
});

// Accessibility enhancements
function toggleLargeText() {
    document.body.classList.toggle('large-text');
    localStorage.setItem('large-text', document.body.classList.contains('large-text'));
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
    localStorage.setItem('high-contrast', document.body.classList.contains('high-contrast'));
}

// Load saved preferences
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('large-text') === 'true') {
        document.body.classList.add('large-text');
    }
    if (localStorage.getItem('high-contrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Initialize the AI assistant
    new SeniorAI();
});

// Add keyboard shortcuts for accessibility
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '+') {
        e.preventDefault();
        toggleLargeText();
    }
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        toggleHighContrast();
    }
});