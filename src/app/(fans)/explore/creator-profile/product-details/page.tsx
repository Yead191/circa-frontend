import ProductDetails from "@/components/ui/fans/explore/creator-profile/product-details";
import { myFetch } from "../../../../../../helpers/myFetch";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProductDetailsPage = async ({ searchParams }: PageProps) => {
    const { productId, id } = await searchParams;
      const data = await myFetch(`/product/${productId}`);
      const productDetails = data?.data || []; 
    console.log("PostDetailsPage Params:", productDetails)
    return (
        <div>
            <ProductDetails productDetails={productDetails} />
        </div>
    );
};

export default ProductDetailsPage;