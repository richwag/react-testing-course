import { Table } from "@radix-ui/themes";
import Skeleton from "react-loading-skeleton";
import QuantitySelector from "../components/QuantitySelector.tsx";
import { useQuery } from "react-query";
import { Product } from "../entities.ts";
import axios from "axios";

function useGetProducts() {
  return useQuery<Product[], Error>({
    queryKey: "products",
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
  });
}
export const ProductList = ({
  selectedCategoryId,
}: {
  selectedCategoryId?: number;
}) => {
  const productsResponse = useGetProducts();

  const {
    data: products,
    isLoading: isProductsLoading,
    error: errorProducts,
  } = productsResponse;

  const skeletons = [1, 2, 3, 4, 5];

  if (errorProducts) return <div>Error: {errorProducts.message}</div>;

  const visibleProducts = selectedCategoryId
    ? products?.filter((p) => p.categoryId === selectedCategoryId)
    : products;

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isProductsLoading &&
          skeletons.map((skeleton) => (
            <Table.Row key={skeleton}>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
              <Table.Cell>
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        {!isProductsLoading &&
          visibleProducts?.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
              <Table.Cell>
                <QuantitySelector product={product} />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};
