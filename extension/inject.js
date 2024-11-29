// Get the URL
const site = window.location.hostname;

// alert("Injector - The Javascript has been injected into the page. The site is: " + site);

// JS Codes for youtube.com
if (site.includes("www.youtube.com")) {
    document.addEventListener("yt-navigate-start", process);
    // Choose a different event depending on when you want to apply the change
    // document.addEventListener("yt-navigate-finish", process);

    if (document.body) process();
    else document.addEventListener("DOMContentLoaded", process);
}

function process() {
    if (!location.pathname.startsWith("/watch")) return;

    console.log('Process function called.');
    
    const observer = new MutationObserver((mutations, obs) => {
        const menuElement = document.querySelector('#top-level-buttons-computed > yt-button-view-model');
        if (menuElement && !document.getElementById('my-custom-button')) {
            console.log('Menu element found:', menuElement);

            (function() {
                // Check if we're on a YouTube video page
                if (window.location.hostname.includes('youtube.com')) {
                    document.addEventListener('yt-navigate-finish', initialize);
                    if (document.readyState === 'complete' || document.readyState === 'interactive') {
                        initialize();
                    } else {
                        document.addEventListener('DOMContentLoaded', initialize);
                    }
                }
            
                function initialize() {
                    if (!location.pathname.startsWith('/watch')) return;
            
                    // Use a MutationObserver to handle dynamic content loading
                    const observer = new MutationObserver((mutations, obs) => {
                        if (document.querySelector('#top-level-buttons-computed') && !document.getElementById('my-custom-button')) {
                            insertButtonIntoMenu();
                            obs.disconnect(); // Stop observing if not needed anymore
                        }
                    });
            
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            
                function createYouTubeButton() {
                    // Create the button element
                    const buttonElement = document.createElement('button');
                    buttonElement.id = 'my-custom-button';
                    buttonElement.className = `
                        yt-spec-button-shape-next
                        yt-spec-button-shape-next--tonal
                        yt-spec-button-shape-next--mono
                        yt-spec-button-shape-next--size-m
                        yt-spec-button-shape-next--icon-leading
                        yt-spec-button-shape-next--enable-backdrop-filter-experiment
                    `.replace(/\s+/g, ' ').trim();

                    // Set ARIA attributes for accessibility
                    buttonElement.setAttribute('aria-label', 'Custom Action');
                    buttonElement.setAttribute('title', 'Custom Action');

                    // Create the icon element (optional)
                    const iconElement = document.createElement('yt-icon');
                    iconElement.style.width = '24px';
                    iconElement.style.height = '24px';

                    // You can use a custom SVG icon or an existing YouTube icon
                    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svgElement.setAttribute('viewBox', '0 0 24 24');
                    svgElement.setAttribute('width', '24');
                    svgElement.setAttribute('height', '24');

                    // Example: Simple circle icon (replace with your desired icon)
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', '12');
                    circle.setAttribute('cy', '12');
                    circle.setAttribute('r', '10');
                    circle.setAttribute('fill', 'white');
                    svgElement.appendChild(circle);

                    iconElement.appendChild(svgElement);

                    // Create the text content div
                    const textContent = document.createElement('div');
                    textContent.className = 'yt-spec-button-shape-next__button-text-content';
                    textContent.textContent = 'Custom';

                    // Append icon and text to the button
                    //buttonElement.appendChild(iconElement);
                    buttonElement.appendChild(textContent);

                    // Add touch feedback shape (optional)
                    const touchFeedback = document.createElement('yt-touch-feedback-shape');
                    touchFeedback.style.borderRadius = 'inherit';
                    touchFeedback.innerHTML = `
                        <div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response" aria-hidden="true">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                        </div>
                    `;
                    buttonElement.appendChild(touchFeedback);

                    // Add an event listener for button functionality
                    buttonElement.addEventListener('click', () => {
                        // Your custom action here
                        alert('Custom button clicked!');
                    });

                    // Return the created button
                    return buttonElement;
                }
            
                function insertButtonIntoMenu() {
                    const buttonMenu = document.querySelector('#top-level-buttons-computed');
            
                    if (buttonMenu) {
                        const customButton = createYouTubeButton();
                        customButton.style.marginLeft = '8px'; // Adjust the margin as needed
            
                        // Insert the button at the desired position
                        buttonMenu.appendChild(customButton);
            
                        console.log('Custom button inserted into the menu.');
                    } else {
                        console.log('Button menu not found.');
                    }
                }
            })();

            //console.log('Button element inserted with yt style.');

            // Disconnect the observer if no longer needed
            obs.disconnect();
        } else {
            console.log('Menu element not found or Button element already inserted.');
        }
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}