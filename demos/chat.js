// Chat Widget Script
(function() {
    // Función para inicializar el widget cuando el DOM esté listo
    function initializeWidget() {
        // Create and inject styles
        const styles = `
            .n8n-chat-widget {
                --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
                --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
                --chat--color-background: var(--n8n-chat-background-color, #ffffff);
                --chat--color-font: var(--n8n-chat-font-color, #333333);
                font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }

            .n8n-chat-widget .chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                display: none;
                width: 380px;
                height: 600px;
                background: var(--chat--color-background);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
                border: 1px solid rgba(133, 79, 255, 0.2);
                overflow: hidden;
                font-family: inherit;
            }

            .n8n-chat-widget .chat-container.position-left {
                right: auto;
                left: 20px;
            }

            .n8n-chat-widget .chat-container.open {
                display: flex;
                flex-direction: column;
            }

            .n8n-chat-widget .brand-header {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid rgba(133, 79, 255, 0.1);
                position: relative;
            }

            .n8n-chat-widget .close-button {
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--chat--color-font);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s;
                font-size: 20px;
                opacity: 0.6;
            }

            .n8n-chat-widget .close-button:hover {
                opacity: 1;
            }

            .n8n-chat-widget .brand-header img {
                width: 32px;
                height: 32px;
            }

            .n8n-chat-widget .brand-header span {
                font-size: 18px;
                font-weight: 500;
                color: var(--chat--color-font);
            }

            .n8n-chat-widget .new-conversation {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                text-align: center;
                width: 100%;
                max-width: 300px;
            }

            .n8n-chat-widget .welcome-text {
                font-size: 24px;
                font-weight: 600;
                color: var(--chat--color-font);
                margin-bottom: 24px;
                line-height: 1.3;
            }

            .n8n-chat-widget .new-chat-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                padding: 16px 24px;
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: transform 0.3s;
                font-weight: 500;
                font-family: inherit;
                margin-bottom: 12px;
            }

            .n8n-chat-widget .new-chat-btn:hover {
                transform: scale(1.02);
            }

            .n8n-chat-widget .message-icon {
                width: 20px;
                height: 20px;
            }

            .n8n-chat-widget .response-text {
                font-size: 14px;
                color: var(--chat--color-font);
                opacity: 0.7;
                margin: 0;
            }

            .n8n-chat-widget .chat-interface {
                display: none;
                flex-direction: column;
                height: 100%;
            }

            .n8n-chat-widget .chat-interface.active {
                display: flex;
            }

            .n8n-chat-widget .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--chat--color-background);
                display: flex;
                flex-direction: column;
            }

            .n8n-chat-widget .chat-message {
                padding: 12px 16px;
                margin: 8px 0;
                border-radius: 12px;
                max-width: 80%;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.5;
            }

            .n8n-chat-widget .chat-message.user {
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                align-self: flex-end;
                box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
                border: none;
            }

            .n8n-chat-widget .chat-message.bot {
                background: var(--chat--color-background);
                border: 1px solid rgba(133, 79, 255, 0.2);
                color: var(--chat--color-font);
                align-self: flex-start;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }

            /* Estilos específicos para imágenes en mensajes */
            .n8n-chat-widget .chat-message img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 8px 0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: transform 0.2s;
            }

            .n8n-chat-widget .chat-message img:hover {
                transform: scale(1.02);
            }

            /* Modal para vista ampliada de imágenes */
            .n8n-chat-widget .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: none;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }

            .n8n-chat-widget .image-modal img {
                max-width: 90%;
                max-height: 90%;
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }

            .n8n-chat-widget .chat-input {
                padding: 16px;
                background: var(--chat--color-background);
                border-top: 1px solid rgba(133, 79, 255, 0.1);
                display: flex;
                gap: 8px;
            }

            .n8n-chat-widget .chat-input textarea {
                flex: 1;
                padding: 12px;
                border: 1px solid rgba(133, 79, 255, 0.2);
                border-radius: 8px;
                background: var(--chat--color-background);
                color: var(--chat--color-font);
                resize: none;
                font-family: inherit;
                font-size: 14px;
            }

            .n8n-chat-widget .chat-input textarea::placeholder {
                color: var(--chat--color-font);
                opacity: 0.6;
            }

            .n8n-chat-widget .chat-input button {
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 0 20px;
                cursor: pointer;
                transition: transform 0.2s;
                font-family: inherit;
                font-weight: 500;
            }

            .n8n-chat-widget .chat-input button:hover {
                transform: scale(1.05);
            }

            .n8n-chat-widget .chat-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 30px;
                background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
                z-index: 999;
                transition: transform 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .n8n-chat-widget .chat-toggle.position-left {
                right: auto;
                left: 20px;
            }

            .n8n-chat-widget .chat-toggle:hover {
                transform: scale(1.05);
            }

            .n8n-chat-widget .chat-toggle svg {
                width: 24px;
                height: 24px;
                fill: currentColor;
            }

            .n8n-chat-widget .chat-footer {
                padding: 8px;
                text-align: center;
                background: var(--chat--color-background);
                border-top: 1px solid rgba(133, 79, 255, 0.1);
            }

            .n8n-chat-widget .chat-footer a {
                color: var(--chat--color-primary);
                text-decoration: none;
                font-size: 12px;
                opacity: 0.8;
                transition: opacity 0.2s;
                font-family: inherit;
            }

            .n8n-chat-widget .chat-footer a:hover {
                opacity: 1;
            }
        `;

        // Load Geist font
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
        document.head.appendChild(fontLink);

        // Inject styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Default configuration
        const defaultConfig = {
            webhook: {
                url: '',
                route: ''
            },
            branding: {
                logo: '',
                name: '',
                welcomeText: '',
                responseTimeText: '',
                poweredBy: {
                    text: '',
                    link: '#'
                }
            },
            style: {
                primaryColor: '',
                secondaryColor: '',
                position: 'right',
                backgroundColor: '#ffffff',
                fontColor: '#333333'
            }
        };

        // Merge user config with defaults
        const config = window.ChatWidgetConfig ? 
            {
                webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
                branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
                style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
            } : defaultConfig;

        // Prevent multiple initializations
        if (window.N8NChatWidgetInitialized) return;
        window.N8NChatWidgetInitialized = true;

        let currentSessionId = '';

        // Create widget container
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'n8n-chat-widget';
        
        // Set CSS variables for colors
        widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
        widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
        widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
        widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

        const chatContainer = document.createElement('div');
        chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
        
        const newConversationHTML = `
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="new-conversation">
                <h2 class="welcome-text">${config.branding.welcomeText}</h2>
                <button class="new-chat-btn">
                    <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                    </svg>
                    Inicia un chat
                </button>
                <p class="response-text">${config.branding.responseTimeText}</p>
            </div>
        `;

        const chatInterfaceHTML = `
            <div class="chat-interface">
                <div class="brand-header">
                    <img src="${config.branding.logo}" alt="${config.branding.name}">
                    <span>${config.branding.name}</span>
                    <button class="close-button">×</button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <textarea placeholder="Escribe tu mensaje aqui..." rows="1"></textarea>
                    <button type="submit">Enviar</button>
                </div>
                <div class="chat-footer">
                    <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
                </div>
            </div>
        `;
        
        chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
        
        const toggleButton = document.createElement('button');
        toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
        toggleButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
            </svg>`;
        
        // Create image modal
        const imageModal = document.createElement('div');
        imageModal.className = 'image-modal';
        imageModal.innerHTML = '<img src="" alt="Enlarged image">';
        
        widgetContainer.appendChild(chatContainer);
        widgetContainer.appendChild(toggleButton);
        widgetContainer.appendChild(imageModal);
        
        // Verificar que document.body existe antes de agregar el widget
        if (document.body) {
            document.body.appendChild(widgetContainer);
        } else {
            console.error('document.body no está disponible');
            return;
        }

        const newChatBtn = chatContainer.querySelector('.new-chat-btn');
        const chatInterface = chatContainer.querySelector('.chat-interface');
        const messagesContainer = chatContainer.querySelector('.chat-messages');
        const textarea = chatContainer.querySelector('textarea');
        const sendButton = chatContainer.querySelector('button[type="submit"]');

        // Función para sanitizar HTML y permitir solo etiquetas seguras
        function sanitizeHTML(html) {
            // Lista de etiquetas permitidas
            const allowedTags = ['img', 'br', 'p', 'div', 'span', 'strong', 'em', 'b', 'i', 'u', 'a'];
            const allowedAttributes = {
                'img': ['src', 'alt', 'title', 'width', 'height'],
                'a': ['href', 'title', 'target']
            };

            // Crear un elemento temporal para parsing
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Función recursiva para limpiar nodos
            function cleanNode(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    return node.textContent;
                }

                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    
                    if (!allowedTags.includes(tagName)) {
                        // Si la etiqueta no está permitida, devolver solo el contenido de texto
                        return node.textContent;
                    }

                    // Crear nuevo elemento limpio
                    const cleanElement = document.createElement(tagName);
                    
                    // Copiar solo atributos permitidos
                    if (allowedAttributes[tagName]) {
                        Array.from(node.attributes).forEach(attr => {
                            if (allowedAttributes[tagName].includes(attr.name)) {
                                cleanElement.setAttribute(attr.name, attr.value);
                            }
                        });
                    }

                    // Procesar hijos recursivamente
                    Array.from(node.childNodes).forEach(child => {
                        const cleanChild = cleanNode(child);
                        if (typeof cleanChild === 'string') {
                            cleanElement.appendChild(document.createTextNode(cleanChild));
                        } else {
                            cleanElement.appendChild(cleanChild);
                        }
                    });

                    return cleanElement;
                }

                return '';
            }

            // Limpiar y reconstruir el contenido
            const cleanDiv = document.createElement('div');
            Array.from(tempDiv.childNodes).forEach(child => {
                const cleanChild = cleanNode(child);
                if (typeof cleanChild === 'string') {
                    cleanDiv.appendChild(document.createTextNode(cleanChild));
                } else {
                    cleanDiv.appendChild(cleanChild);
                }
            });

            return cleanDiv.innerHTML;
        }

        // Función para crear mensaje con soporte para HTML
        function createBotMessage(content) {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            
            // Sanitizar y establecer contenido HTML
            const sanitizedContent = sanitizeHTML(content);
            botMessageDiv.innerHTML = sanitizedContent;
            
            // Agregar event listeners para imágenes
            const images = botMessageDiv.querySelectorAll('img');
            images.forEach(img => {
                // Agregar funcionalidad de clic para ampliar imagen
                img.addEventListener('click', function() {
                    const modalImg = imageModal.querySelector('img');
                    modalImg.src = this.src;
                    modalImg.alt = this.alt || 'Imagen ampliada';
                    imageModal.style.display = 'flex';
                });

                // Manejar errores de carga de imagen
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                    const errorText = document.createElement('span');
                    errorText.textContent = '[Imagen no disponible]';
                    errorText.style.color = '#999';
                    errorText.style.fontStyle = 'italic';
                    this.parentNode.insertBefore(errorText, this.nextSibling);
                });
            });
            
            return botMessageDiv;
        }

        // Event listener para cerrar modal de imagen
        imageModal.addEventListener('click', function() {
            this.style.display = 'none';
        });

        function generateUUID() {
            return crypto.randomUUID();
        }

        async function startNewConversation() {
            currentSessionId = generateUUID();
            const data = [{
                action: "loadPreviousSession",
                sessionId: currentSessionId,
                route: config.webhook.route,
                metadata: {
                    userId: ""
                }
            }];

            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
                chatContainer.querySelector('.brand-header').style.display = 'none';
                chatContainer.querySelector('.new-conversation').style.display = 'none';
                chatInterface.classList.add('active');

                const content = Array.isArray(responseData) ? responseData[0].output : responseData.output;
                const botMessageDiv = createBotMessage(content);
                messagesContainer.appendChild(botMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
            }
        }

        async function sendMessage(message) {
            const messageData = {
                action: "sendMessage",
                sessionId: currentSessionId,
                route: config.webhook.route,
                chatInput: message,
                metadata: {
                    userId: ""
                }
            };

            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = message;
            messagesContainer.appendChild(userMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(messageData)
                });
                
                const data = await response.json();
                
                const content = Array.isArray(data) ? data[0].output : data.output;
                const botMessageDiv = createBotMessage(content);
                messagesContainer.appendChild(botMessageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
            }
        }

        newChatBtn.addEventListener('click', startNewConversation);
        
        sendButton.addEventListener('click', () => {
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        });
        
        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const message = textarea.value.trim();
                if (message) {
                    sendMessage(message);
                    textarea.value = '';
                }
            }
        });
        
        toggleButton.addEventListener('click', () => {
            chatContainer.classList.toggle('open');
        });

        // Add close button handlers
        const closeButtons = chatContainer.querySelectorAll('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                chatContainer.classList.remove('open');
            });
        });
    }

    // Verificar si el DOM ya está cargado
    if (document.readyState === 'loading') {
        // DOM aún se está cargando, esperar al evento DOMContentLoaded
        document.addEventListener('DOMContentLoaded', initializeWidget);
    } else {
        // DOM ya está cargado, inicializar inmediatamente
        initializeWidget();
    }
})();
