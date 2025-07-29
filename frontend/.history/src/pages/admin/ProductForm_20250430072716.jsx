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
  const [imageQuality, setImageQuality] = useState(80); // Default image quality (0-100)
  const [applyWatermark, setApplyWatermark] = useState(false); // Toggle for watermark
  const [watermarkText, setWatermarkText] = useState(""); // Watermark text
  const [autoFormat, setAutoFormat] = useState(true); // Auto format conversion (webp when supported)

  const categories = ["Fashion", "Electronics", "Home", "Toys", "Books"]; // Dropdown options

  // Cloudinary configuration
  const CLOUD_NAME = "diyrz1xmm"; // Your cloud name
  const UPLOAD_PRESET = "greenbin"; // Your unsigned preset
  
  // Image optimization presets
  const imagePresets = {
    thumbnail: { width: 100, height: 100, crop: "fill" },
    small: { width: 300, height: 300, crop: "fill" },
    medium: { width: 600, height: 600, crop: "limit" },
    large: { width: 1200, height: 1200, crop: "limit" }
  };

  // Function to create optimized Cloudinary URLs for an original image URL
  const createOptimizedUrls = (originalUrl) => {
    // Base transformation parameters
    const formatParam = autoFormat ? "f_auto" : "";
    const qualityParam = `q_${imageQuality}`;
    
    // Create optimized versions
    const result = {
      original: originalUrl,
      optimized: {},
    };
    
    // Generate URLs for each preset
    Object.entries(imagePresets).forEach(([size, preset]) => {
      const transformations = [
        `c_${preset.crop}`,
        `w_${preset.width}`,
        `h_${preset.height}`,
        formatParam,
        qualityParam
      ].filter(Boolean).join(",");
      
      // Add watermark if enabled
      let watermarkParam = "";
      if (applyWatermark && watermarkText) {
        watermarkParam = `/l_text:Arial_20:${encodeURIComponent(watermarkText)},co_white,g_south_east,x_5,y_5`;
      }
      
      // Extract base URL (before /upload/)
      const baseUrlParts = originalUrl.split('/upload/');
      if (baseUrlParts.length === 2) {
        result.optimized[size] = `${baseUrlParts[0]}/upload/${transformations}${watermarkParam}/${baseUrlParts[1]}`;
      }
    });
    
    return result;
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    
    // Add eager transformations for immediate optimization
    const eagerTransformations = [
      // Thumbnail version
      "c_fill,h_100,w_100",
      // Small version
      "c_fill,h_300,w_300",
      // Medium version with quality and format optimization
      `c_limit,h_600,w_600,q_${imageQuality},f_auto`,
      // Large version with quality and format optimization
      `c_limit,h_1200,w_1200,q_${imageQuality},f_auto`
    ];
    
    // If watermark is enabled, add it to the transformations
    if (applyWatermark && watermarkText) {
      const watermarkTransform = `/l_text:Arial_20:${encodeURIComponent(watermarkText)},co_white,g_south_east,x_5,y_5`;
      eagerTransformations.forEach((transform, i) => {
        eagerTransformations[i] = transform + watermarkTransform;
      });
    }
    
    formData.append("eager", eagerTransformations.join("|"));
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    
    // Create optimized URLs from the response
    const optimizedUrls = {
      imageUrl: response.data.secure_url,
      publicId: response.data.public_id,
      format: response.data.format,
      versions: {
        thumbnail: response.data.eager[0].secure_url,
        small: response.data.eager[1].secure_url,
        medium: response.data.eager[2].secure_url,
        large: response.data.eager[3].secure_url
      }
    };
    
    return optimizedUrls;
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
    
    // Validate file sizes (limit to 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`${oversizedFiles.length} file(s) exceed the 5MB size limit. Please optimize before uploading.`);
      return;
    }
    
    // Create object URLs for preview
    const newSelectedFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB", // Show file size in KB
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
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(selectedFiles[indexToRemove].preview);
    setSelectedFiles(newSelectedFiles);
  };

  // Function to set a selected file as primary
  const setSelectedFilePrimary = (selectedIndex) => {
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

  // This function now handles the upload logic and returns the results
  const uploadImages = async (filesToUpload) => {
    if (filesToUpload.length === 0) {
      return [];
    }
    
    try {
      const uploadedImages = await Promise.all(
        filesToUpload.map(async (fileObj) => {
          const imageData = await uploadImage(fileObj.file);
          return {
            ...imageData,
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

  // Function to preview how an image would look with the current optimization settings
  const previewOptimizedImage = async (fileObj) => {
    if (!fileObj) return;
    
    setUploading(true);
    try {
      // Upload with current settings just to show preview
      const preview = await uploadImage(fileObj.file);
      alert("Preview image uploaded. Check the 'Uploaded Images' section to see the optimized version.");
      
      // Add to images array but mark as a preview
      setImages([...images, { 
        ...preview,
        primary: false,
        isPreview: true  // Mark as preview
      }]);
    } catch (error) {
      console.error("Error generating preview:", error);
      alert("Failed to generate preview. Please try again.");
    } finally {
      setUploading(false);
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
      // Filter out preview images
      let allImages = images.filter(img => !img.isPreview);
      
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
          allImages = [...allImages, ...newImages];
        } finally {
          document.body.removeChild(uploadingMessage);
        }
      }
      
      // Prepare the product data with optimized image paths
      const productData = {
        pName,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        // Send optimized image data
        images: allImages.map(img => ({
          primary: img.primary,
          imageUrl: img.imageUrl,
          thumbnailUrl: img.versions?.thumbnail || img.imageUrl,
          smallUrl: img.versions?.small || img.imageUrl,
          mediumUrl: img.versions?.medium || img.imageUrl,
          largeUrl: img.versions?.large || img.imageUrl,
          publicId: img.publicId,
          format: img.format
        })),
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

      {/* Image Optimization Settings Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="font-semibold mb-3 text-gray-700">Image Optimization Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Quality ({imageQuality}%)
            </label>
            <input
              type="range"
              min="30"
              max="100"
              value={imageQuality}
              onChange={(e) => setImageQuality(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower quality = smaller file size
            </p>
          </div>
          
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Format Options</label>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="autoFormat"
                checked={autoFormat}
                onChange={(e) => setAutoFormat(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="autoFormat" className="text-sm">Auto format (WebP when supported)</label>
            </div>
            <p className="text-xs text-gray-500">
              Modern formats like WebP can reduce file size by up to 30%
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="applyWatermark"
              checked={applyWatermark}
              onChange={(e) => setApplyWatermark(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="applyWatermark" className="text-sm font-medium text-gray-700">
              Apply Watermark
            </label>
          </div>
          
          {applyWatermark && (
            <input
              type="text"
              placeholder="Watermark text (e.g. Your Brand Name)"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="border p-2 w-full rounded focus:ring focus:ring-blue-300 focus:outline-none"
            />
          )}
        </div>
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
            Select up to 4 images (PNG, JPG, JPEG only, max 5MB each).
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
                <div className="flex flex-col text-xs mt-1 text-center">
                  <span className="truncate max-w-24">{fileObj.name}</span>
                  <span className="text-gray-500">{fileObj.size}</span>
                </div>
                
                {/* Preview Optimization Button */}
                <button
                  onClick={() => previewOptimizedImage(fileObj)}
                  disabled={uploading}
                  className="mt-1 text-xs w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                >
                  Preview Optimization
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">
            Images will be optimized and uploaded when you save the product.
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-gray-700">Uploaded Images:</h2>
          <div className="flex gap-4 flex-wrap">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                {/* Show thumbnail for better performance */}
                <img 
                  src={img.versions?.thumbnail || img.imageUrl} 
                  alt="Uploaded" 
                  className="w-32 h-32 object-cover rounded border" 
                />
                
                {img.primary && (
                  <span className="absolute top-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-br">
                    Primary
                  </span>
                )}
                
                {img.isPreview && (
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">
                    Preview
                  </span>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-black bg-opacity-50 p-1">
                  <button 
                    onClick={() => setPrimaryImage(idx)}
                    disabled={img.primary || img.isPreview}
                    className={`text-xs px-1 rounded ${img.primary || img.isPreview ? 'text-gray-400' : 'text-white hover:text-green-300'}`}
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
                
                {/* Image format and optimization info */}
                {img.versions && (
                  <div className="text-xs mt-1 text-center text-gray-600">
                    {img.format && (
                      <span className="bg-gray-200 px-1 py-0.5 rounded">{img.format.toUpperCase()}</span>
                    )}
                    {" "}4 sizes created
                  </div>
                )}
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
        className="bg-green-600 text-white px-6 py-3 rounded text-lg w-full hover:bg-green-700 transition disabled:bg-green-400"
      >
        {uploading ? "Processing..." : "Save Product"}
      </button>
    </div>
  );
};

export default ProductForm;