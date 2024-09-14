const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');

menuIcon.addEventListener('click', function() {
    sidebar.classList.toggle('active');
});