async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:3000/api/products");
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (e: any) {
    console.log("error in fetching");
    throw Error("error");
  }
}

export default async function Page() {
  const product = (await fetchProducts()) ?? [];

  if (product.data?.success === true) {
    console.log(product);
    return (
      <div>
        <p> Products</p>
        {product.map((p: any) => (
          <span key={p.id}>{p}</span>
        ))}
      </div>
    );
  }
  return <span>No data fetched</span>;
}
