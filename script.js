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
        
        setTimeout(async () => {
            const response = await this.generateResponse(message);
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
    
    async generateResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Check if this is a search-like query (questions about facts, weather, etc.)
        if (this.isSearchQuery(message)) {
            return await this.handleSearchQuery(userMessage);
        }
        
        // Check if this is a how-to question
        if (this.isHowToQuery(message)) {
            return this.handleHowToQuery(message);
        }
        
        // Email safety responses
        if (message.includes('email') || message.includes('spam') || message.includes('phishing')) {
            return `
                <strong>Hey! Let me help you stay safe with emails:</strong>
                <ul>
                    <li>Don't click links from people you don't know - trust me on this one!</li>
                    <li>If you weren't expecting an attachment, don't download it</li>
                    <li>If an email asks for personal info, it's probably a scam</li>
                    <li>Look closely at the sender's email - scammers use fake addresses that look real</li>
                    <li>When in doubt, just delete it! You can always call me or the family if you're unsure</li>
                </ul>
                Here's the thing - real companies will NEVER ask for your passwords in an email. Promise!
            `;
        }
        
        // Shopping safety
        if (message.includes('shop') || message.includes('buy') || message.includes('purchase')) {
            return `
                <strong>Alright, let's talk safe online shopping!</strong>
                <ul>
                    <li>Look for "https://" and a little lock icon - that means it's secure</li>
                    <li>Stick to the big names like Amazon, Target, or the store's actual website</li>
                    <li>Never let websites save your credit card - I know it's convenient, but trust me!</li>
                    <li>Read what other people say about new websites before buying</li>
                    <li>If a deal looks too amazing to be true, it probably is</li>
                    <li>PayPal is your friend - use it when you can for extra protection</li>
                </ul>
                Quick tip: Always double-check that website address before you type in your card info!
            `;
        }
        
        // Social media help
        if (message.includes('facebook') || message.includes('social') || message.includes('instagram')) {
            return `
                <strong>Let's keep you safe on social media!</strong>
                <ul>
                    <li>Keep your profile private and only accept requests from people you actually know</li>
                    <li>Don't share your address or phone number - keep that stuff private!</li>
                    <li>Don't post about being away from home while you're still gone</li>
                    <li>Even if a link comes from a friend, be careful - their account might be hacked</li>
                    <li>If someone makes you uncomfortable, block them! Don't feel bad about it</li>
                </ul>
                Here's something important: once you post something online, it's there forever - so always think twice!
            `;
        }
        
        // Video calling help
        if (message.includes('video') || message.includes('call') || message.includes('zoom') || message.includes('skype')) {
            return `
                <strong>Video calling is easier than you think!</strong>
                <ul>
                    <li><strong>Good apps to use:</strong> Zoom, Skype, WhatsApp, or FaceTime if you have an iPhone/iPad</li>
                    <li>Sit near a window for good lighting - you'll look great!</li>
                    <li>Test your camera and microphone first so you don't have surprises</li>
                    <li>Don't share personal info with people you don't know well</li>
                    <li>Learn where the mute button is - trust me, you'll need it!</li>
                </ul>
                Pro tip: Ask me or another family member to help you practice - we love spending time with you!
            `;
        }
        
        // Password help
        if (message.includes('password') || message.includes('login') || message.includes('account')) {
            return `
                <strong>Let's talk about keeping your passwords safe!</strong>
                <ul>
                    <li>Use a different password for each important account - I know it's a pain, but it's worth it</li>
                    <li>Make them at least 12 characters long</li>
                    <li>Mix it up with uppercase, lowercase, numbers, and symbols</li>
                    <li>Try phrases you'll remember: "MyDog#Fluffy2024!" or "Coffee&Cookies99!"</li>
                    <li>Never share passwords with anyone (except maybe write them down for emergencies)</li>
                    <li>Your browser can remember passwords for you - pretty handy!</li>
                </ul>
                Old school tip: Write down your important passwords and keep them somewhere safe at home!
            `;
        }
        
        // Scam prevention
        if (message.includes('scam') || message.includes('fraud') || message.includes('suspicious')) {
            return `
                <strong>Listen, scammers are everywhere, but I've got your back!</strong>
                <ul>
                    <li>If someone calls or emails out of the blue asking for money or info, it's probably a scam</li>
                    <li>The government doesn't call to threaten you - they send boring letters instead</li>
                    <li>Your bank will NEVER ask for your PIN or full password - ever!</li>
                    <li>Anything "urgent" or "limited time only" is usually trying to pressure you</li>
                    <li>Never let strangers control your computer remotely - big red flag!</li>
                    <li>When in doubt, hang up and call the real number yourself</li>
                </ul>
                Trust your gut - if something feels fishy, it probably is! Call me or the family if you're not sure.
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
                Hey there! I'm so glad you're here! Think of me as your tech-savvy grandson who's always happy to help. I can help you with:
                <ul>
                    <li><strong>Finding stuff online</strong> - Ask me "What's the weather?" or "How do I find recipes?"</li>
                    <li><strong>Step-by-step walkthroughs</strong> - "How do I email photos?" or "How do I video call?"</li>
                    <li><strong>Staying safe online</strong> - I'll teach you how to spot scams and stay secure</li>
                    <li><strong>Computer basics</strong> - No question is too simple - I promise!</li>
                    <li><strong>Simple explanations</strong> - I'll break everything down so it makes sense</li>
                </ul>
                So, what do you want to figure out today? Ask me anything or click those handy buttons below!
            `;
        }
        
        // Default response
        return `
            I hear what you're asking about "${userMessage}", and while I might not have the exact answer, let me share some general tips to keep you safe online:
            <ul>
                <li>Don't share personal info unless you're absolutely sure who you're talking to</li>
                <li>If something seems weird, just ask me or call one of the kids - we're here for you!</li>
                <li>Take your time - nobody's rushing you, so don't feel pressured</li>
                <li>Keep your computer updated when it asks - those updates are important</li>
            </ul>
            Try asking me about email safety, shopping online, social media, video calls, passwords, or avoiding scams!
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
        
        setTimeout(async () => {
            const response = await this.generateResponse(question);
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
    
    async performWebSearch(query) {
        try {
            // For weather queries, provide current weather guidance
            if (query.toLowerCase().includes('weather')) {
                return await this.getWeatherGuidance(query);
            }

            // For all other queries, provide smart search guidance to reliable sources
            return this.getSearchGuidance(query);
        } catch (error) {
            console.log('Search error:', error);
            return null;
        }
    }


    async getWeatherGuidance(query) {
        return {
            answer: `I can't check the current weather for you directly, but I can show you the best ways to get accurate weather information right now!`,
            source: 'Weather Guidance',
            title: 'How to Check Current Weather',
            isGuidance: true
        };
    }

    getSearchGuidance(query) {
        return {
            answer: `I'll help you search for "${query}" using the best websites and search engines!`,
            source: 'Search Guidance',
            title: 'Let me guide your search',
            isGuidance: true
        };
    }

    getEnhancedGuidance(query, searchResult) {
        const message = query.toLowerCase();

        if (message.includes('weather')) {
            return `
                <strong>Let me help you check the current weather!</strong>
                <div class="step-guide">
                    <div class="step">
                        <span class="step-number">1.</span>
                        <span class="step-text">Go to <strong>weather.com</strong> or <strong>weather.gov</strong> - these are the most reliable</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2.</span>
                        <span class="step-text">Type your city and state in the search box</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3.</span>
                        <span class="step-text">You'll see current temperature, conditions, and a 7-day forecast</span>
                    </div>
                    <div class="step">
                        <span class="step-number">4.</span>
                        <span class="step-text">Check the hourly forecast if you're planning to go out</span>
                    </div>
                </div>
                💡 <strong>Quick tip:</strong> If you have a smartphone, just ask Siri "What's the weather?" or say "Hey Google, what's the weather today?"
            `;
        }

        // Enhanced search guidance with diverse reliable sources
        return `
            <strong>Great question! Let me help you find reliable information about "${query}"</strong>
            <div class="step-guide">
                <div class="step">
                    <span class="step-number">1.</span>
                    <span class="step-text">Start with <strong>google.com</strong> and search for "${query}"</span>
                </div>
                <div class="step">
                    <span class="step-number">2.</span>
                    <span class="step-text">Look for these trusted sources first:</span>
                </div>
                <div class="step">
                    <span class="step-number">📚</span>
                    <span class="step-text"><strong>Government sites</strong> (.gov) - Most reliable for official information</span>
                </div>
                <div class="step">
                    <span class="step-number">🎓</span>
                    <span class="step-text"><strong>Educational sites</strong> (.edu) - Universities and academic institutions</span>
                </div>
                <div class="step">
                    <span class="step-number">📰</span>
                    <span class="step-text"><strong>Reputable news sources</strong> - BBC, NPR, Reuters, AP News</span>
                </div>
                <div class="step">
                    <span class="step-number">🔬</span>
                    <span class="step-text"><strong>Professional organizations</strong> - Medical associations, scientific societies</span>
                </div>
                <div class="step">
                    <span class="step-number">3.</span>
                    <span class="step-text">Always check multiple sources - don't rely on just one!</span>
                </div>
            </div>
            💡 <strong>Smart tip:</strong> Be skeptical of dramatic headlines or claims that seem too good to be true. When in doubt, ask me or call the family!
        `;
    }

    async handleSearchQuery(query) {
        // First try to get real search results
        const searchResult = await this.performWebSearch(query);

        if (searchResult) {
            if (searchResult.isGuidance) {
                // For guidance responses, provide enhanced step-by-step help
                return this.getEnhancedGuidance(query, searchResult);
            } else {
                // For actual results (like Wikipedia), display them nicely
                return `
                    <strong>Great question! Here's what I found about "${query}":</strong>
                    <div class="search-result">
                        <h4>${searchResult.title}</h4>
                        <p>${searchResult.answer}</p>
                        <p><small>Source: <a href="${searchResult.source}" target="_blank" rel="noopener">Read more on ${searchResult.source}</a></small></p>
                    </div>
                    <p>💡 <strong>Want to learn more?</strong> Ask me another question or click those helpful buttons on the left!</p>
                `;
            }
        }

        // Fallback to instructional responses if search fails
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
                💡 <strong>Cool trick:</strong> If you have Siri, Alexa, or Google Assistant, just ask "What's the weather today?"
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
                💡 <strong>Smart move:</strong> Print the recipe by pressing Ctrl+P - then you won't need the computer while cooking!
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
                ⚠️ <strong>Watch out:</strong> Avoid those crazy headlines that seem too wild to be true - they're just trying to get clicks!
            `;
        }
        
        // Generic search response
        return `
            <strong>Let me help you search for "${query}"!</strong>
            <p>Here's how to find good information online:</p>
            <div class="step-guide">
                <div class="step">
                    <span class="step-number">1.</span>
                    <span class="step-text">Go to <strong>google.com</strong> or <strong>bing.com</strong> (my favorites)</span>
                </div>
                <div class="step">
                    <span class="step-number">2.</span>
                    <span class="step-text">Type your question in the search box</span>
                </div>
                <div class="step">
                    <span class="step-number">3.</span>
                    <span class="step-text">Look for trusted websites (government sites end in .gov, schools end in .edu)</span>
                </div>
            </div>
            💡 <strong>Pro tip:</strong> Be specific - instead of "dogs", try "best dog breeds for seniors" and you'll get better results!
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
                💡 <strong>Heads up:</strong> Big photos take time to send, so if you have lots, maybe send a few at a time!
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
                💡 <strong>My advice:</strong> Practice with us first so you feel confident with all the buttons!
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
                💡 <strong>Don't worry:</strong> Take your time and don't be afraid to click around - you won't break anything, I promise!
            `;
        }
        
        // Generic how-to response
        return `
            <strong>I'd love to help you figure out "${query}"!</strong>
            <p>I don't have the exact steps for that one, but here's my general game plan:</p>
            <div class="step-guide">
                <div class="step">
                    <span class="step-number">1.</span>
                    <span class="step-text">Break it down into small, manageable steps</span>
                </div>
                <div class="step">
                    <span class="step-number">2.</span>
                    <span class="step-text">Ask me or another family member for help - we're here for you!</span>
                </div>
                <div class="step">
                    <span class="step-number">3.</span>
                    <span class="step-text">Try searching online for "how to [your task] for beginners"</span>
                </div>
                <div class="step">
                    <span class="step-number">4.</span>
                    <span class="step-text">Take your time and don't stress about it</span>
                </div>
            </div>
            Ask me about emailing photos, video calling, or computer basics - those I know really well!
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