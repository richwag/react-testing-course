import { render } from "@testing-library/react";
import ProductImageGallery from "./ProductImageGallery.tsx";

describe("ProductImageGallery", () => {
    it("should render nothing when the gallery is empty", () => {
        const dom = render(<ProductImageGallery imageUrls={[]}/>);
        expect(dom.container).toBeEmptyDOMElement();
    });

    it("should render an image for each url", () => {
        const urls = ["http://example.com/image1.jpg", "http://example.com/image2.jpg"];
        const dom = render(<ProductImageGallery imageUrls={urls}/>);

        const images = dom.container.querySelectorAll("img");
        expect(images).toHaveLength(2);

        images.forEach((image, index) => {
            expect(image).toHaveAttribute("src", urls[index]);
        });
    });
});