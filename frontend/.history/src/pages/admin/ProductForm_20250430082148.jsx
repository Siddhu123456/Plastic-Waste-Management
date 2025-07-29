import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [pName, setPName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // Store selected files before upload
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

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files);
    
    // Validate file types
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert("Only PNG, JPG, and JPEG image files are allowed.");
      return;
    }
    
    // Limit to 4 files total (existing selected + new)
    const totalFiles = [...selectedFiles, ...files];
    
    if (totalFiles.length > 4) {
      alert("You can only select up to 4 images total.");
      return;
    }
    
    // Create object URLs for preview
    const newSelectedFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      primary: selectedFiles.length === 0 && images.length === 0 // Make first selected file primary if no other files exist
    }));
    
    setSelectedFiles([...selectedFiles, ...newSelectedFiles]);
  };

  const removeSelectedFile = (indexToRemove) => {
    const isPrimaryRemoved = selectedFiles[indexToRemove].primary;
    const newSelectedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    
    // If we're removing the primary image and there are other selected files left,
    // make the first remaining selected file primary
    if (isPrimaryRemoved && newSelectedFiles.length > 0) {
      newSelectedFiles[0].primary = true;
    }
    
    setSelectedFiles(newSelectedFiles);
  };

  // New function to set a selected file as primary
  const setSelectedFilePrimary = (selectedIndex) => {
    console.log(selectedFiles)
    const updatedSelectedFiles = selectedFiles.map((file, idx) => ({
      ...file,
      primary: idx === selectedIndex
    }));
    setSelectedFiles(updatedSelectedFiles);
    
    // If we're setting a selected file as primary, make sure none of the uploaded
    // images are marked as primary
    if (images.length > 0) {
      const updatedImages = images.map(img => ({
        ...img,
        primary: false
      }));
      setImages(updatedImages);
    }
  };

  // This function now just handles the upload logic and returns the results
  const uploadImages = async (filesToUpload) => {
    if (filesToUpload.length === 0) {
      return [];
    }
    
    try {
      const uploadedImages = await Promise.all(
        filesToUpload.map(async (fileObj) => {
          const url = await uploadImage(fileObj.file);
          return {
            imageUrl: url,
            primary: fileObj.primary
          };
        })
      );
      
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload one or more images. Please try again.");
    }
  };

  // Function to set an uploaded image as primary
  const setPrimaryImage = (selectedIndex) => {
    // Update uploaded images
    const updatedImages = images.map((img, idx) => ({
      ...img,
      primary: idx === selectedIndex
    }));
    setImages(updatedImages);
    
    // Make sure none of the selected files are marked as primary
    if (selectedFiles.length > 0) {
      const updatedSelectedFiles = selectedFiles.map(file => ({
        ...file,
        primary: false
      }));
      setSelectedFiles(updatedSelectedFiles);
    }
  };

  // Function to remove an image
  const removeImage = (indexToRemove) => {
    const isPrimaryRemoved = images[indexToRemove].primary;
    const filteredImages = images.filter((_, idx) => idx !== indexToRemove);
    
    // If we're removing the primary image and there are other images left,
    // make the first remaining image primary
    if (isPrimaryRemoved) {
      if (filteredImages.length > 0) {
        filteredImages[0].primary = true;
      } else if (selectedFiles.length > 0) {
        // If no uploaded images are left but we have selected files,
        // make the first selected file primary
        const updatedSelectedFiles = [...selectedFiles];
        updatedSelectedFiles[0].primary = true;
        setSelectedFiles(updatedSelectedFiles);
      }
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
    
    // Check if we have any images (either already uploaded or selected)
    if (images.length === 0 && selectedFiles.length === 0) {
      alert("Please select at least one image!");
      return;
    }
    
    // Check if we have a primary image (either uploaded or selected)
    const hasPrimaryImage = images.some(img => img.primary) || selectedFiles.some(file => file.primary);
    
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
      // First, upload any selected files that haven't been uploaded yet
      let allImages = [...images];
      
      if (selectedFiles.length > 0) {
        const uploadingMessage = document.createElement('div');
        uploadingMessage.textContent = `Uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...`;
        uploadingMessage.style.position = 'fixed';
        uploadingMessage.style.top = '50%';
        uploadingMessage.style.left = '50%';
        uploadingMessage.style.transform = 'translate(-50%, -50%)';
        uploadingMessage.style.padding = '20px';
        uploadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        uploadingMessage.style.color = 'white';
        uploadingMessage.style.borderRadius = '5px';
        uploadingMessage.style.zIndex = '9999';
        document.body.appendChild(uploadingMessage);
        
        try {
          const newImages = await uploadImages(selectedFiles);
          allImages = [...images, ...newImages];
        } finally {
          document.body.removeChild(uploadingMessage);
        }
      }
      
      const productData = {
        pName,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        images: allImages,
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
      setImages([]);
      setSelectedFiles([]);
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
            disabled={uploading || selectedFiles.length >= 4}
          />
          <p className="text-sm text-gray-500">
            Select up to 4 images (PNG, JPG, JPEG only). First uploaded image will be set as primary by default.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {4 - selectedFiles.length} image slots remaining
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-gray-700">Selected Images:</h2>
          <div className="flex gap-4 flex-wrap">
            {selectedFiles.map((fileObj, idx) => (
              <div key={idx} className="relative">
                <img src={fileObj.preview} alt="Selected" className="w-24 h-24 object-cover rounded border" />
                {fileObj.primary && (
                  <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-br">
                    Primary
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1 flex justify-between">
                  <button 
                    onClick={() => setSelectedFilePrimary(idx)}
                    disabled={fileObj.primary}
                    className={`text-xs px-1 rounded ${fileObj.primary ? 'text-gray-400' : 'text-white hover:text-green-300'}`}
                  >
                    {fileObj.primary ? 'Primary' : 'Set Primary'}
                  </button>
                  <button 
                    onClick={() => removeSelectedFile(idx)}
                    className="text-xs text-white hover:text-red-300 px-1 rounded"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-xs mt-1 text-center truncate max-w-24">{fileObj.name}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">
            Images will be uploaded when you save the product.
          </p>
        </div>
      )}

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