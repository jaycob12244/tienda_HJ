import ProductDetailView from "../../components/ProductDetailView";
import products from "../../data/products.json";
import MainLayout from "../../layouts/MainLayout";

export default function ProductDetailPage({ product, relatedProducts }) {
  return (
    <MainLayout>
      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </MainLayout>
  );
}

export function getStaticPaths() {
  return {
    paths: products.map((product) => ({
      params: { slug: product.slug },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const product = products.find((item) => item.slug === params.slug);
  const relatedProducts = products
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .concat(products.filter((item) => item.slug !== product.slug && item.category !== product.category))
    .slice(0, 3);

  return {
    props: {
      product,
      relatedProducts,
    },
  };
}
