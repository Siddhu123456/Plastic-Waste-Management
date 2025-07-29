import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [pName, setPName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState([{ featureName: "", featureValue: "" }]);

  const categories = ["Fashion", "Electronics", "Home", "Toys", "Books"]; // 🔥 Dropdown options

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "greenbin"); // ⚡ your unsigned preset

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/diyrz1xmm/image/upload", // ⚡ your cloud name
      formData
    );
    return response.data.secure_url;
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const url = await uploadImage(file);
        return {
          imageUrl: url,
          primary: index === 0 && images.length === 0 // ✅ First uploaded image is primary if none exists
        };
      })
    );

    setImages([...images, ...uploadedImages]);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][field] = value;
    setFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, { featureName: "", featureValue: "" }]);
  };

  const saveProduct = async () => {
    if (!images.some(img => img.primary)) {
      alert("At least one primary image is required!");
      return;
    }
    if (!category) {
      alert("Please select a category!");
      return;
    }
    if (!features.length || features.some(f => !f.featureName || !f.featureValue)) {
      alert("Please add at least one valid feature!");
      return;
    }

    const productData = {
      pName,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      images,
      features
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/product",
        productData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Product saved successfully:", response.data);
      alert("Product saved!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Product Name"
          value={pName}
          onChange={(e) => setPName(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        ></textarea>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 flex-1"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2 flex-1"
        />
      </div>

      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Upload Images</label>
        <input type="file" multiple onChange={handleImageUpload} />
      </div>

      {images.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Uploaded Images:</h2>
          <div className="flex gap-4 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img.imageUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded" />
                {img.primary && <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 rounded-br">Primary</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Features:</h2>
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Feature Name"
              value={feature.featureName}
              onChange={(e) => handleFeatureChange(idx, "featureName", e.target.value)}
              className="border p-2 flex-1"
            />
            <input
              type="text"
              placeholder="Feature Value"
              value={feature.featureValue}
              onChange={(e) => handleFeatureChange(idx, "featureValue", e.target.value)}
              className="border p-2 flex-1"
            />
          </div>
        ))}
        <button
          onClick={addFeature}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Feature
        </button>
      </div>

      <button
        onClick={saveProduct}
        className="bg-green-600 text-white px-6 py-3 rounded text-lg"
      >
        Save Product
      </button>
    </div>
  );
};

export default ProductForm;
