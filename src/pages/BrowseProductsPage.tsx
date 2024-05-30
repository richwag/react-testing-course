import { useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import SelectCategory from "./RenderCategories.tsx";
import { ProductList } from "./ProductList.tsx";

function BrowseProducts() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >();

  return (
    <div>
      <h1>Products</h1>
      <div className="max-w-xs">
        <SelectCategory setSelectedCategoryId={setSelectedCategoryId} />{" "}
      </div>
      <ProductList selectedCategoryId={selectedCategoryId} />
    </div>
  );
}

export default BrowseProducts;
