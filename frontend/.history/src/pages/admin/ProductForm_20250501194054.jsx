import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [pName, setPName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [allImages, setAllImages] = useState([]); // Combined state for all images
  const [uploading, setUploading] = useState(false);
  const [features, setFeatures] = useState([{ featureName: "", featureValue: "" }]);

  const categories = ["Households", "Electronics", "Home", "Toys", "Books"];

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    
    // Validate file types
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert("Only PNG, JPG, and JPEG image files are allowed.");
      return;
    }
    
    // Limit to 4 files total
    const totalFiles = [...allImages, ...files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      primary: allImages.length === 0, // Make first image primary if no other images exist
      isUploaded: false
    }))];
    
    if (totalFiles.length > 4) {
      alert("You can only select up to 4 images total.");
      return;
    }
    
    setAllImages(totalFiles);
  };

  const removeImage = (indexToRemove) => {
    const isPrimaryRemoved = allImages[indexToRemove].primary;
    const filteredImages = allImages.filter((_, idx) => idx !== indexToRemove);
    
    // If we're removing the primary image and there are other images left,
    // make the first remaining image primary
    if (isPrimaryRemoved && filteredImages.length > 0) {
      filteredImages[0].primary = true;
    }
    
    setAllImages(filteredImages);
  };

  // Single function to set any image as primary
  const setPrimaryImage = (selectedIndex) => {
    const updatedImages = allImages.map((img, idx) => ({
      ...img,
      primary: idx === selectedIndex
    }));
    setAllImages(updatedImages);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "greenbin"); // Your unsigned preset

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/diyrz1xmm/image/upload", // Your cloud name
      formData
    );
    return response.data.secure_url;
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
    
    // Check if we have any images
    if (allImages.length === 0) {
      alert("Please select at least one image!");
      return;
    }
    
    // Check if we have a primary image
    const hasPrimaryImage = allImages.some(img => img.primary);
    
    if (!hasPrimaryImage) {
      alert("At least one primary image is required!");
      return;
    }
    
    if (!features.length || features.some(f => !f.featureName.trim() || !f.featureValue.trim())) {
      alert("Please add at least one valid feature!");
      return;
    }

    setUploading(true);
    
    try {
      // Upload any images that haven't been uploaded yet
      const finalImages = [];
      
      // Find images that need to be uploaded
      const imagesToUpload = allImages.filter(img => !img.isUploaded);
      
      // Upload progress counter
      let uploadedCount = 0;
      
      // Process each image
      for (const img of allImages) {
        if (!img.isUploaded && img.file) {
          try {
            const imageUrl = await uploadImage(img.file);
            finalImages.push({
              imageUrl,
              primary: img.primary
            });
            uploadedCount++;
          } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload one or more images. Please try again.");
          }
        } else if (img.isUploaded && img.imageUrl) {
          // This is an already uploaded image
          finalImages.push({
            imageUrl: img.imageUrl,
            primary: img.primary
          });
        }
      }
      
      const productData = {
        pName,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        images: finalImages,
        features
      };

      const response = await axios.post(
        "http://localhost:8080/api/product/add",
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
      setAllImages([]);
      setFeatures([{ featureName: "", featureValue: "" }]);
    } catch (error) {
      console.error("Error saving product:", error);
      if (error.message && error.message.includes("Failed to upload")) {
        alert(error.message);
      } else {
        alert("Error saving product. Please try again.");
      }
    } finally {
      setUploading(false);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Images</label>
        <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
          <input 
            type="file" 
            multiple 
            accept=".png,.jpg,.jpeg,image/png,image/jpeg" 
            onChange={handleFileSelection} 
            className="mb-2"
            disabled={uploading || allImages.length >= 4}
          />
          <p className="text-sm text-gray-500">
            Select up to 4 images (PNG, JPG, JPEG only). First image will be set as primary by default.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {4 - allImages.length} image slots remaining
          </p>
        </div>
      </div>

      {allImages.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-gray-700">Product Images:</h2>
          <div className="flex gap-4 flex-wrap">
            {allImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img 
                  src={img.isUploaded ? img.imageUrl : img.preview} 
                  alt={img.name || "Product image"} 
                  className="w-24 h-24 object-cover rounded border" 
                />
                {img.primary && (
                  <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-br">
                    Primary
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 flex justify-between">
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
                {!img.isUploaded && (
                  <div className="text-xs mt-1 text-center truncate max-w-24">{img.name}</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">
            Images will be uploaded when you save the product.
          </p>
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
        disabled={uploading}
        className={`${uploading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} 
                   text-white px-6 py-3 rounded text-lg w-full transition flex items-center justify-center`}
      >
        {uploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading Images & Saving...
          </>
        ) : (
          'Save Product'
        )}
      </button>
    </div>
  );
};

export default ProductForm;