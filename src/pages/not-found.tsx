import notFoundImageSrc from "../assets/svgs/404_image.svg"
import { AppLink } from "../components/app-link";
export const NotFound = () => (
  <main className="not-found-page">
    <img src={notFoundImageSrc} alt="not found asset" />
    <AppLink id="/" button style={
      {
        maxWidth: 600,
      }
    } />
  </main>
);
