// Animations for Project Emergence

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Marker
  const nav = document.querySelector('.nav');
  const navMarker = document.createElement('div');
  navMarker.classList.add('nav-marker');
  nav.appendChild(navMarker);

  const navBtns = document.querySelectorAll('.nav-btn');
  const activeBtn = document.querySelector('.nav-btn.active');

  function moveMarker(target) {
    navMarker.style.width = `${target.offsetWidth}px`;
    navMarker.style.left = `${target.offsetLeft}px`;
  }

  if (activeBtn) {
    moveMarker(activeBtn);
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      navBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      moveMarker(e.currentTarget);
    });
  });

  // Staggered animations for cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animation = `fadeInUp 0.8s ease ${index * 0.2}s both`;
  });
});

// Keyframes for animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
