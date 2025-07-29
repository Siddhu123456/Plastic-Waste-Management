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
  const [uploading, setUploading] = useState(false);

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
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          const url = await uploadImage(file);
          return {
            imageUrl: url,
            // Set as primary only if it's the first image AND there are no existing images
            primary: index === 0 && images.length === 0
          };
        })
      );

      setImages([...images, ...uploadedImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // New function to set an image as primary
  const setPrimaryImage = (selectedIndex) => {
    const updatedImages = images.map((img, idx) => ({
      ...img,
      primary: idx === selectedIndex
    }));
    setImages(updatedImages);
  };

  // Function to remove an image
  const removeImage = (indexToRemove) => {
    const isPrimaryRemoved = images[indexToRemove].primary;
    const filteredImages = images.filter((_, idx) => idx !== indexToRemove);
    
    // If we're removing the primary image and there are other images left,
    // make the first remaining image primary
    if (isPrimaryRemoved && filteredImages.length > 0) {
      filteredImages[0].primary = true;
    }
    
    setImages(filteredImages);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][field] = value;
    setFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, { featureName: "", featureValue: "" }]);
  };

  const removeFeature = (indexToRemove) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, idx) => idx !== indexToRemove));
    }
  };

  const saveProduct = async () => {
    // Basic validation
    if (!pName.trim()) {
      alert("Product name is required!");
      return;
    }
    
    if (!description.trim()) {
      alert("Description is required!");
      return;
    }
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      alert("Please enter a valid price!");
      return;
    }
    
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      alert("Please enter a valid stock quantity!");
      return;
    }
    
    if (!category) {
      alert("Please select a category!");
      return;
    }
    
    if (images.length === 0) {
      alert("Please upload at least one image!");
      return;
    }
    
    if (!images.some(img => img.primary)) {
      alert("At least one primary image is required!");
      return;
    }
    
    if (!features.length || features.some(f => !f.featureName.trim() || !f.featureValue.trim())) {
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
      alert("Product saved successfully!");
      
      // Reset form after successful save
      setPName("");
      setDescription("");
      setPrice("");
      setStock("");
      setCategory("");
      setImages([]);
      setFeatures([{ featureName: "", featureValue: "" }]);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Product</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={pName}
          onChange={(e) => setPName(e.target.value)}
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded h-32 focus:ring focus:ring-blue-300 focus:outline-none"
        ></textarea>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 w-full rounded focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border p-2 w-full rounded focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300 focus:outline-none"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
          <input 
            type="file" 
            multiple 
            onChange={handleImageUpload} 
            className="mb-2"
            disabled={uploading}
          />
          <p className="text-sm text-gray-500">Upload multiple images. First image will be set as primary by default.</p>
          {uploading && <p className="text-sm text-blue-500 mt-2">Uploading images...</p>}
        </div>
      </div>

      {images.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-gray-700">Uploaded Images:</h2>
          <div className="flex gap-4 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img.imageUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded border" />
                {img.primary && (
                  <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-br">
                    Primary
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-black bg-opacity-50 p-1">
                  <button 
                    onClick={() => setPrimaryImage(idx)}
                    disabled={img.primary}
                    className={`text-xs px-1 rounded ${img.primary ? 'text-gray-400' : 'text-white hover:text-green-300'}`}
                  >
                    {img.primary ? 'Primary' : 'Set Primary'}
                  </button>
                  <button 
                    onClick={() => removeImage(idx)}
                    className="text-xs text-white hover:text-red-300 px-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="font-semibold mb-2 text-gray-700">Features:</h2>
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Feature Name"
              value={feature.featureName}
              onChange={(e) => handleFeatureChange(idx, "featureName", e.target.value)}
              className="border p-2 flex-1 rounded focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Feature Value"
              value={feature.featureValue}
              onChange={(e) => handleFeatureChange(idx, "featureValue", e.target.value)}
              className="border p-2 flex-1 rounded focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <button
              onClick={() => removeFeature(idx)}
              disabled={features.length === 1}
              className={`p-2 rounded ${features.length === 1 ? 'text-gray-400' : 'text-red-500 hover:bg-red-100'}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addFeature}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-2"
        >
          Add Feature
        </button>
      </div>

      <button
        onClick={saveProduct}
        className="bg-green-600 text-white px-6 py-3 rounded text-lg w-full hover:bg-green-700 transition"
      >
        Save Product
      </button>
    </div>
  );
};

export default ProductForm;