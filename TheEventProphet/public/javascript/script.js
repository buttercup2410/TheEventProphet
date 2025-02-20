function flyOwl(event) {
    const owl = document.getElementById('animated-owl');
    const cursorX = event.clientX - 65;
    const cursorY = event.clientY - 65;
    const shouldMirror = cursorX > window.innerWidth / 2;

    if (shouldMirror) {
        owl.classList.add('owl-mirror');
    } else {
        owl.classList.remove('owl-mirror');
    }

    owl.style.top = `${cursorY}px`;
    owl.style.left = `${cursorX}px`;
    owl.classList.add('owl-flying');
    setTimeout(() => {
        owl.classList.remove('owl-flying');
    }, 5000);
}

window.onmousemove = flyOwl;
