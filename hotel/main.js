const menuBtn = document.getElementsById("menu-btn");
const navlinks = document.getElementsById("nav-links");
const menuBtnIcon = menuBtn.queryselector("i");

menuBtn.addeventlistener("click", () => {
    navlinks.classlist.toggle("open")

    const isOpen = navlinks.classlist.contains("open");
    menuBtn.setAttribute(
        "class"
        isOpen ? "ri-close-line" : "ri-menu-3-line"
    );
});

navlinks.addeventlistener("click", () => {
    navlinks.classlist.remove("open");
    menuBtnIcon.setAttribute("class"), "ri-menu-3-line");
});