let selectionCount = 0;
let selectedImages = [];

document.addEventListener('DOMContentLoaded', function() {
    const mainContainer = document.getElementById('pics');
    const favContainer = document.getElementById('favourites');
    const actionsList = document.getElementById('actionsList');
    const remainingSpan = document.getElementById('remainingCounter');
    const orderSpan = document.getElementById('selectionOrder');
    const totalImages = mainContainer.querySelectorAll('.image-card').length;
    
    function updateRemainingCount() {
        const remaining = mainContainer.querySelectorAll('.image-card[data-moved="false"]').length;
        remainingSpan.textContent = remaining;
        if (remaining === 0) {
            remainingSpan.style.color = '#10b981';
        } else {
            remainingSpan.style.color = '#a1a6ae';
        }
    }
    
    function updateOrderDisplay() {
        if (selectionCount === 0) {
            orderSpan.textContent = 'None';
            orderSpan.style.color = '#3b82f6';
        } else {
            orderSpan.textContent = selectionCount;
            orderSpan.style.color = '#10b981';
        }
    }
    
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.textContent = message;
        
        let bgColor = '#10b981';
        if (type === 'final') bgColor = '#8b5cf6';
        if (type === 'revert') bgColor = '#3b82f6';
        
        toast.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: ${bgColor};
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideInRight 0.3s ease;
            font-family: 'Segoe UI', sans-serif;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
    
    function addActionToLog(text, isSpecial = false) {
        if (actionsList.querySelector('.empty-message')) {
            actionsList.innerHTML = '';
        }
        
        const li = document.createElement('li');
        li.textContent = text;
        
        if (isSpecial) {
            li.style.backgroundColor = '#d1fae5';
            li.style.color = '#065f46';
            li.style.fontWeight = 'bold';
            li.style.borderLeftColor = '#10b981';
        }
        
        actionsList.appendChild(li);
        actionsList.scrollTop = actionsList.scrollHeight;
    }
    
    function getFileNameFromPath(path) {
        const parts = path.split('/');
        return parts[parts.length - 1];
    }
    
    function moveToFavorites(card, imgSrc, imgAlt, imageId) {
        if (card.getAttribute('data-moved') === 'true') return;
        
        selectionCount++;
        card.setAttribute('data-moved', 'true');
        card.classList.add('selected');
        
        const favCard = document.createElement('div');
        favCard.className = 'image-card';
        favCard.setAttribute('data-id', imageId);
        
        const newImg = document.createElement('img');
        newImg.src = imgSrc;
        newImg.alt = imgAlt;
        newImg.className = 'gallery-img';
        newImg.title = imgAlt;
        
        favCard.appendChild(newImg);
        favContainer.appendChild(favCard);
        
        const fileName = getFileNameFromPath(imgSrc);
        addActionToLog(`Moved ${fileName} to favorites`);
        
        selectedImages.push({
            id: imageId,
            element: favCard,
            original: card,
            src: imgSrc,
            alt: imgAlt
        });
        
        showToast(`Image selected as favorite number ${selectionCount}`);
        updateRemainingCount();
        updateOrderDisplay();
        
        if (selectionCount === totalImages) {
            showToast('All images have been selected!', 'final');
            addActionToLog('✓ ALL IMAGES HAVE BEEN SELECTED!', true);
        }
        
        favCard.addEventListener('click', function(e) {
            e.stopPropagation();
            revertFromFavorites(favCard, card, imgSrc, imgAlt, imageId);
        });
    }
    
    function revertFromFavorites(favCard, originalCard, imgSrc, imgAlt, imageId) {
        originalCard.setAttribute('data-moved', 'false');
        originalCard.classList.remove('selected');
        
        const originalImg = originalCard.querySelector('img');
        if (originalImg) {
            originalImg.src = imgSrc;
            originalImg.alt = imgAlt;
        }
        
        favCard.remove();
        
        selectedImages = selectedImages.filter(item => item.id !== imageId);
        
        const fileName = getFileNameFromPath(imgSrc);
        addActionToLog(`Reverted ${fileName} back to the main list`);
        
        selectionCount--;
        updateRemainingCount();
        updateOrderDisplay();
        
        showToast(`Reverted ${fileName} from favourites`, 'revert');
        
        const finalMessage = Array.from(actionsList.querySelectorAll('li')).find(li => 
            li.textContent.includes('ALL IMAGES HAVE BEEN SELECTED')
        );
        if (finalMessage && selectionCount < totalImages) {
            finalMessage.remove();
        }
        
        if (selectionCount === 0 && actionsList.children.length === 0) {
            actionsList.innerHTML = '<li class="empty-message">No actions performed yet</li>';
        }
    }
    
    const imageCards = mainContainer.querySelectorAll('.image-card');
    imageCards.forEach(card => {
        const img = card.querySelector('img');
        img.title = img.alt;
        
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            if (card.getAttribute('data-moved') !== 'true') {
                moveToFavorites(card, img.src, img.alt, card.getAttribute('data-id'));
            }
        });
    });
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);
    
    updateRemainingCount();
    updateOrderDisplay();
});