import { useQuery } from "react-query";
import { Category } from "../entities.ts";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { Select } from "@radix-ui/themes";

export function useGetCategories() {
  return useQuery<Category[], Error>({
    queryKey: "categories",
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data),
  });
}

const SelectCategory = ({
  setSelectedCategoryId,
}: {
  setSelectedCategoryId: (categoryId: number) => void;
}) => {
  const categoriesResponse = useGetCategories();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: errorCategories,
  } = categoriesResponse;

  if (isCategoriesLoading) return <Skeleton />;
  if (errorCategories) return <div>Error: {errorCategories.message}</div>;
  return (
    <Select.Root
      onValueChange={(categoryId) =>
        setSelectedCategoryId(parseInt(categoryId))
      }
    >
      <Select.Trigger placeholder="Filter by Category" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value="all">All</Select.Item>
          {categories?.map((category) => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default SelectCategory;
