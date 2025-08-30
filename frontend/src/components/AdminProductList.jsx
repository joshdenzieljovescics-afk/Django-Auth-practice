import React, { useEffect, useState } from "react";

// for listing products and addting products
import api from "../api";
import { ACCESS_TOKEN } from "../token";
import "../styles/AdminProducts.css";
import { toast } from "react-toastify";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    descripton: "",
    price: "",
    quantity: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.get(ACCESS_TOKEN);
        if (!token) {
          throw new Error("No access token found");
        }
        const response = await api.get("api/products/", {
          headers: {
            Authorization: `Bearer ${token}}`,
          },
        });
        setProducts(response.data.results); // access the results /because the setProducts is an array/ from products API
      } catch (error) {
        console.error("Error getting products", error);
        setError("Failed to get products");
        toast.error("Failed to get products");
      }
    };
    fetchProducts();
  }, []);

  // handle change for input products form
  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };
  // handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  //Handle form submission to add new product with 1 image
  const handleSubmit = async () => {
    e.preventDefault();
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        throw new Error("No access token found");
      }
      //get the form data to include image in the request
      const form_data = new FormData();
      FormData.append("name", newProduct.name);
      FormData.append("description", newProduct.description);
      FormData.append("price", newProduct.price);
      FormData.append("quantity", newProduct.quantity);
      if (image) {
        formData.append("image", image);
      }

      const res = await api.post("api/products/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // This is required to place when you upload a file or if theres a file upload?
        },
      });
      // update frontend after operation of the function
      setProducts([...products, res.data]); // This here is for adding new product to the your product list
      setNewProduct({ name: "", descripton: "", price: "", quantity: "" }); // This is for resetting the form filled.
      setImage(null);
      toast.success("Product added succesffuly"); //Call this to display success pop up.
    } catch (error) {
      console.error("Error adding product: ", error);
      setError("Failed to add product.");
      toast.error("Failed to add product");
    }
  };
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="admin-container">
      <h1>Manage Products</h1>
      <ul>
        {products.length > 0 ? (
          products.map((products) => (
            <li key={products.id}>
              {/* <img src={products.img} alt={products.name} /> */}
              {products.name} -{" "}
              <a href={`/api/products/${products.id}`}>Edit</a>
              {/* <h2>{products.name}</h2>
                        <p>{products.description}</p>
                        <p>{products.price}</p>
                        <p>{products.quantity}</p> */}
            </li>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </ul>

      {/* Add new products */}
      <h2>Add new product.</h2>
      <form action={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="descripton"
            value={newProduct.descripton}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="depricescripton"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AdminProductList;
