import AppIcon from "./app-icon"


export default function ScrollToTop() {
    function scroll() {
        document.documentElement.scrollTop = 0;
    }
    return <button className="scrollToTop"><AppIcon name="ArrowCircleUp" onClick={scroll} /></button>
}