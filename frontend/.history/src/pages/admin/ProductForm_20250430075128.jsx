import React, { useState, useCallback, useEffect } from "react";
import { CloudinaryContext, Image, Transformation } from "cloudinary";

const ProductForm = () => {
  const [pName, setPName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [uploadWidget, setUploadWidget] = useState(null);
  const [features, setFeatures] = useState([{ featureName: "", featureValue: "" }]);
  const [uploading, setUploading] = useState(false);

  const categories = ["Fashion", "Electronics", "Home", "Toys", "Books"];
  
  const cloudName = "diyrz1xmm"; // Your cloud name
  const uploadPreset = "greenbin"; // Your upload preset

  // Initialize Cloudinary widget on component mount
  useEffect(() => {
    if (window.cloudinary) {
      // Create and configure the upload widget
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          maxFiles: 4,
          resourceType: "image",
          clientAllowedFormats: ["png", "jpg", "jpeg"],
          sources: ["local", "url", "camera"],
          multiple: true,
          maxFileSize: 5000000, // 5MB
          showAdvancedOptions: false,
          cropping: false,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            handleUploadSuccess(result.info);
          }
          if (error) {
            console.error("Upload error:", error);
          }
        }
      );
      
      setUploadWidget(widget);
    }
    
    // Clean up function
    return () => {
      if (uploadWidget) {
        uploadWidget.close();
      }
    };
  }, []);

  // Handle successful image upload
  const handleUploadSuccess = useCallback((result) => {
    const newImage = {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      primary: images.length === 0 // Make first image primary by default
    };
    
    setImages(prevImages => {
      // If this is the first image and we're adding it, make it primary
      if (prevImages.length === 0) {
        return [newImage];
      }
      
      // Otherwise, add the new image without changing primary status
      return [...prevImages, newImage];
    });
  }, [images.length]);

  // Set an image as primary
  const setPrimaryImage = (selectedIndex) => {
    const updatedImages = images.map((img, idx) => ({
      ...img,
      primary: idx === selectedIndex
    }));
    setImages(updatedImages);
  };

  // Remove an image
  const removeImage = (indexToRemove) => {
    const isPrimaryRemoved = images[indexToRemove].primary;
    const filteredImages = images.filter((_, idx) => idx !== indexToRemove);
    
    // If we removed the primary image and there are others left, make the first one primary
    if (isPrimaryRemoved && filteredImages.length > 0) {
      filteredImages[0].primary = true;
    }
    
    setImages(filteredImages);
  };

  // Feature management functions
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

  // Form validation and submission
  const validateForm = () => {
    if (!pName.trim()) {
      alert("Product name is required!");
      return false;
    }
    
    if (!description.trim()) {
      alert("Description is required!");
      return false;
    }
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      alert("Please enter a valid price!");
      return false;
    }
    
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      alert("Please enter a valid stock quantity!");
      return false;
    }
    
    if (!category) {
      alert("Please select a category!");
      return false;
    }
    
    if (images.length === 0) {
      alert("Please upload at least one image!");
      return false;
    }
    
    if (!images.some(img => img.primary)) {
      alert("Please set a primary image!");
      return false;
    }
    
    if (!features.length || features.some(f => !f.featureName.trim() || !f.featureValue.trim())) {
      alert("Please add at least one valid feature!");
      return false;
    }
    
    return true;
  };

  const saveProduct = async () => {
    if (!validateForm()) return;
    
    setUploading(true);
    
    try {
      const productData = {
        pName,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        images,
        features
      };

      const response = await fetch("http://localhost:8080/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      
      const responseData = await response.json();
      console.log("Product saved successfully:", responseData);
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
    } finally {
      setUploading(false);
    }
  };

  return (
    <CloudinaryContext cloudName={cloudName}>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center">
            <p className="text-sm text-gray-500 mb-2">
              Upload up to 4 images (PNG, JPG, JPEG only)
            </p>
            
            <button
              onClick={() => uploadWidget && uploadWidget.open()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              disabled={images.length >= 4 || uploading}
            >
              Upload Images
            </button>
            
            <p className="text-sm text-gray-500 mt-2">
              {4 - images.length} image slots remaining
            </p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-gray-700">Uploaded Images:</h2>
            <div className="flex gap-4 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  {img.publicId ? (
                    <Image publicId={img.publicId} className="w-32 h-32 object-cover rounded border">
                      <Transformation crop="fill" width="128" height="128" quality="auto" fetchFormat="auto" />
                    </Image>
                  ) : (
                    <img src={img.imageUrl} alt="Uploaded" className="w-32 h-32 object-cover rounded border" />
                  )}
                  
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
          disabled={uploading}
          className={`text-white px-6 py-3 rounded text-lg w-full transition ${
            uploading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {uploading ? 'Processing...' : 'Save Product'}
        </button>
      </div>
    </CloudinaryContext>
  );
};

export default ProductForm;