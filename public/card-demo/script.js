
const cardCanvas = document.getElementById('cardCanvas');
const ctx = cardCanvas.getContext('2d');

// Basic placeholders
const playerNameInput = document.getElementById('playerName');
const playerTeamInput = document.getElementById('playerTeam');
const imageUpload = document.getElementById('imageUpload');
const renderBtn = document.getElementById('renderBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Store the user's uploaded image in a global var so we can draw it
let userImage = null;
imageUpload.addEventListener('change', handleImageUpload);

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    userImage = new Image();
    userImage.onload = () => {
      // Automatically render the card when image loads
      drawCard();
    };
    userImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

// On click, we "render" the card with the current inputs
renderBtn.addEventListener('click', drawCard);

// Download the card as an image
downloadBtn.addEventListener('click', downloadCard);

function drawCard() {
  // Clear the canvas
  ctx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);

  // Draw a background
  const gradient = ctx.createLinearGradient(0, 0, 0, cardCanvas.height);
  gradient.addColorStop(0, '#FBB930');
  gradient.addColorStop(1, '#F58220');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, cardCanvas.width, cardCanvas.height);

  // Draw a border
  ctx.strokeStyle = '#02483A';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, cardCanvas.width - 20, cardCanvas.height - 20);

  // Draw an inner border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, cardCanvas.width - 40, cardCanvas.height - 40);

  // 1) If user uploaded an image, draw it at some position
  if (userImage) {
    // Calculate dimensions to maintain aspect ratio
    const maxWidth = 369;
    const maxHeight = 400;
    let imgWidth = userImage.width;
    let imgHeight = userImage.height;
    
    if (imgWidth > maxWidth || imgHeight > maxHeight) {
      const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
      imgWidth = imgWidth * ratio;
      imgHeight = imgHeight * ratio;
    }
    
    // Center the image
    const imgX = (cardCanvas.width - imgWidth) / 2;
    const imgY = 80;
    
    // Draw a background behind the image
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(imgX - 10, imgY - 10, imgWidth + 20, imgHeight + 20);
    
    // Draw the image
    ctx.drawImage(userImage, imgX, imgY, imgWidth, imgHeight);
    
    // Draw a frame around the image
    ctx.strokeStyle = '#02483A';
    ctx.lineWidth = 3;
    ctx.strokeRect(imgX - 10, imgY - 10, imgWidth + 20, imgHeight + 20);
  } else {
    // Placeholder for image
    const imgX = 50;
    const imgY = 80;
    const imgW = 369;
    const imgH = 400;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(imgX - 10, imgY - 10, imgW + 20, imgH + 20);
    
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(imgX, imgY, imgW, imgH);
    
    // Draw a placeholder icon
    ctx.fillStyle = '#02483A';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('📷', cardCanvas.width / 2, 250);
    ctx.font = '20px sans-serif';
    ctx.fillText('Upload an image', cardCanvas.width / 2, 300);
    
    ctx.strokeStyle = '#02483A';
    ctx.lineWidth = 3;
    ctx.strokeRect(imgX - 10, imgY - 10, imgW + 20, imgH + 20);
  }

  // 2) Draw a header 
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 30, cardCanvas.width, 40);
  
  ctx.fillStyle = '#02483A';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PIXELPLAY CARDS', cardCanvas.width / 2, 60);

  // 3) Draw the player's name
  const nameY = userImage ? 520 : 520;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(playerNameInput.value || 'Player Name', cardCanvas.width / 2, nameY);

  // 4) Draw the Team / Pop Theme text
  ctx.font = 'italic 20px sans-serif';
  ctx.fillText(playerTeamInput.value || 'Team / Theme', cardCanvas.width / 2, nameY + 30);

  // 5) Draw a logo or emblem in the bottom
  ctx.beginPath();
  ctx.arc(cardCanvas.width / 2, 590, 40, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.stroke();
  
  // Draw PP letters in the circle
  ctx.fillStyle = '#02483A';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PP', cardCanvas.width / 2, 600);
}

function downloadCard() {
  // Create a temporary link
  const link = document.createElement('a');
  const playerName = playerNameInput.value || 'Card';
  link.download = `${playerName.replace(/\s+/g, '_')}_card.png`;
  link.href = cardCanvas.toDataURL('image/png');
  link.click();
}

// Draw the initial card on page load
window.addEventListener('load', drawCard);
