import React, { useState, useCallback, useMemo } from "react";
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
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = ["Fashion", "Electronics", "Home", "Toys", "Books"]; // 🔥 Dropdown options
  
  // Maximum allowed file size (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  // Maximum number of images allowed
  const MAX_IMAGES = 4;

  const remainingSlots = useMemo(() => 
    MAX_IMAGES - (images.length + selectedFiles.length), 
    [images.length, selectedFiles.length]
  );

  // Compress and resize image before upload
  const processImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      // Skip processing if file is already small enough
      if (file.size <= MAX_FILE_SIZE / 2) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          // Target max dimensions of 1200px
          const MAX_DIMENSION = 1200;
          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw resized image to canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to Blob with reduced quality
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create a new file from the blob
            const optimizedFile = new File(
              [blob], 
              file.name, 
              { type: 'image/jpeg', lastModified: Date.now() }
            );
            
            resolve(optimizedFile);
          }, 'image/jpeg', 0.85); // Adjust quality here (0.85 = 85% quality)
        };
        
        img.onerror = () => {
          reject(new Error('Image loading failed'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('File reading failed'));
      };
    });
  }, []);

  const uploadImage = useCallback(async (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "greenbin"); // ⚡ your unsigned preset

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/diyrz1xmm/image/uploa", // ⚡ your cloud name
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        }
      }
    );
    return response.data.secure_url;
  }, []);

  const handleFileSelection = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    
    if (!files.length) return;
    
    // Validate file types
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const invalidFiles = files.filter(file => !validImageTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert("Only PNG, JPG, and JPEG image files are allowed.");
      return;
    }
    
    // Validate file size
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(", ");
      alert(`Some files exceed the 5MB limit: ${fileNames}`);
    }
    
    // Filter out oversized files
    const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);
    if (!validFiles.length) return;
    
    // Limit to MAX_IMAGES files total (existing selected + new)
    const totalFiles = [...selectedFiles, ...validFiles];
    
    if (totalFiles.length > MAX_IMAGES) {
      alert(`You can only select up to ${MAX_IMAGES} images total.`);
      // Only take the first N files that would fit the limit
      const availableSlots = MAX_IMAGES - selectedFiles.length;
      if (availableSlots <= 0) return;
      validFiles.splice(availableSlots);
    }
    
    // Process selected files (compress/resize)
    const processedFiles = [];
    setUploading(true);
    
    try {
      for (const file of validFiles) {
        const processedFile = await processImage(file);
        const preview = URL.createObjectURL(processedFile);
        
        processedFiles.push({
          file: processedFile,
          preview,
          name: file.name,
          primary: selectedFiles.length === 0 && images.length === 0 // Make first selected file primary if no other files exist
        });
      }
      
      setSelectedFiles([...selectedFiles, ...processedFiles]);
    } catch (error) {
      console.error("Error processing images:", error);
      alert("There was an error processing your images.");
    } finally {
      setUploading(false);
    }
  }, [selectedFiles, images.length, processImage, MAX_IMAGES]);

  const removeSelectedFile = useCallback((indexToRemove) => {
    const isPrimaryRemoved = selectedFiles[indexToRemove].primary;
    const newSelectedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    
    // If we're removing the primary image and there are other selected files left,
    // make the first remaining selected file primary
    if (isPrimaryRemoved && newSelectedFiles.length > 0) {
      newSelectedFiles[0].primary = true;
    }
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(selectedFiles[indexToRemove].preview);
    
    setSelectedFiles(newSelectedFiles);
  }, [selectedFiles]);

  // Set a selected file as primary
  const setSelectedFilePrimary = useCallback((selectedIndex) => {
    setSelectedFiles(prev => {
      const updated = prev.map((file, idx) => ({
        ...file,
        primary: idx === selectedIndex
      }));
      return updated;
    });
    
    // If we're setting a selected file as primary, make sure none of the uploaded
    // images are marked as primary
    setImages(prev => {
      if (prev.length === 0) return prev;
      return prev.map(img => ({
        ...img,
        primary: false
      }));
    });
  }, []);

  // Upload images with progress tracking
  const uploadImages = useCallback(async (filesToUpload) => {
    if (filesToUpload.length === 0) {
      return [];
    }
    
    try {
      setUploadProgress(0);
      const totalFiles = filesToUpload.length;
      let completedFiles = 0;
      
      const uploadedImages = await Promise.all(
        filesToUpload.map(async (fileObj) => {
          const url = await uploadImage(fileObj.file, (fileProgress) => {
            // Calculate overall progress considering already completed files
            const overallProgress = Math.round(
              ((completedFiles * 100) + fileProgress) / totalFiles
            );
            setUploadProgress(overallProgress);
          });
          
          completedFiles++;
          return {
            imageUrl: url,
            primary: fileObj.primary
          };
        })
      );
      
      // Clean up previews to prevent memory leaks
      filesToUpload.forEach(fileObj => {
        if (fileObj.preview) {
          URL.revokeObjectURL(fileObj.preview);
        }
      });
      
      setUploadProgress(100);
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload one or more images. Please try again.");
    }
  }, [uploadImage]);

  // Function to set an uploaded image as primary
  const setPrimaryImage = useCallback((selectedIndex) => {
    // Update uploaded images
    setImages(prev => prev.map((img, idx) => ({
      ...img,
      primary: idx === selectedIndex
    })));
    
    // Make sure none of the selected files are marked as primary
    setSelectedFiles(prev => {
      if (prev.length === 0) return prev;
      return prev.map(file => ({
        ...file,
        primary: false
      }));
    });
  }, []);

  // Function to remove an image
  const removeImage = useCallback((indexToRemove) => {
    setImages(prev => {
      const isPrimaryRemoved = prev[indexToRemove].primary;
      const filteredImages = prev.filter((_, idx) => idx !== indexToRemove);
      
      // If we're removing the primary image and there are other images left,
      // make the first remaining image primary
      if (isPrimaryRemoved) {
        if (filteredImages.length > 0) {
          filteredImages[0].primary = true;
        } else if (selectedFiles.length > 0) {
          // If no uploaded images are left but we have selected files,
          // make the first selected file primary
          setSelectedFiles(files => {
            const updated = [...files];
            updated[0].primary = true;
            return updated;
          });
        }
      }
      
      return filteredImages;
    });
  }, [selectedFiles.length]);

  const handleFeatureChange = useCallback((index, field, value) => {
    setFeatures(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  }, []);

  const addFeature = useCallback(() => {
    setFeatures(prev => [...prev, { featureName: "", featureValue: "" }]);
  }, []);

  const removeFeature = useCallback((indexToRemove) => {
    setFeatures(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  }, []);

  const validateForm = useCallback(() => {
    // Basic validation
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
    
    // Check if we have any images (either already uploaded or selected)
    if (images.length === 0 && selectedFiles.length === 0) {
      alert("Please select at least one image!");
      return false;
    }
    
    // Check if we have a primary image (either uploaded or selected)
    const hasPrimaryImage = images.some(img => img.primary) || selectedFiles.some(file => file.primary);
    
    if (!hasPrimaryImage) {
      alert("At least one primary image is required!");
      return false;
    }
    
    if (!features.length || features.some(f => !f.featureName.trim() || !f.featureValue.trim())) {
      alert("Please add at least one valid feature!");
      return false;
    }
    
    return true;
  }, [pName, description, price, stock, category, images, selectedFiles, features]);

  const saveProduct = useCallback(async () => {
    if (!validateForm()) return;
    
    setUploading(true);
    
    try {
      // First, upload any selected files that haven't been uploaded yet
      let allImages = [...images];
      
      if (selectedFiles.length > 0) {
        const newImages = await uploadImages(selectedFiles);
        allImages = [...images, ...newImages];
        
        // Clear selected files after successful upload
        setSelectedFiles([]);
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
      setUploadProgress(0);
    }
  }, [images, selectedFiles, pName, description, price, stock, category, features, uploadImages, validateForm]);

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
          disabled={uploading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded h-32 focus:ring focus:ring-blue-300 focus:outline-none"
          disabled={uploading}
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
            min="0.01"
            step="0.01"
            disabled={uploading}
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
            min="0"
            step="1"
            disabled={uploading}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full rounded focus:ring focus:ring-blue-300 focus:outline-none"
          disabled={uploading}
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
            disabled={uploading || remainingSlots <= 0}
          />
          <p className="text-sm text-gray-500">
            Select up to {MAX_IMAGES} images (PNG, JPG, JPEG only, max 5MB each). Images will be optimized automatically.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {remainingSlots} image {remainingSlots === 1 ? 'slot' : 'slots'} remaining
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
                    disabled={fileObj.primary || uploading}
                    className={`text-xs px-1 rounded ${fileObj.primary ? 'text-gray-400' : 'text-white hover:text-green-300'}`}
                  >
                    {fileObj.primary ? 'Primary' : 'Set Primary'}
                  </button>
                  <button 
                    onClick={() => removeSelectedFile(idx)}
                    disabled={uploading}
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
                    disabled={img.primary || uploading}
                    className={`text-xs px-1 rounded ${img.primary ? 'text-gray-400' : 'text-white hover:text-green-300'}`}
                  >
                    {img.primary ? 'Primary' : 'Set Primary'}
                  </button>
                  <button 
                    onClick={() => removeImage(idx)}
                    disabled={uploading}
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

      {uploading && uploadProgress > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-center mt-1 text-gray-600">
            Uploading: {uploadProgress}%
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
              disabled={uploading}
            />
            <input
              type="text"
              placeholder="Feature Value"
              value={feature.featureValue}
              onChange={(e) => handleFeatureChange(idx, "featureValue", e.target.value)}
              className="border p-2 flex-1 rounded focus:ring focus:ring-blue-300 focus:outline-none"
              disabled={uploading}
            />
            <button
              onClick={() => removeFeature(idx)}
              disabled={features.length === 1 || uploading}
              className={`p-2 rounded ${features.length === 1 || uploading ? 'text-gray-400' : 'text-red-500 hover:bg-red-100'}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addFeature}
          className={`bg-blue-500 text-white px-4 py-2 rounded transition mt-2 ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          disabled={uploading}
        >
          Add Feature
        </button>
      </div>

      <button
        onClick={saveProduct}
        disabled={uploading}
        className={`bg-green-600 text-white px-6 py-3 rounded text-lg w-full transition ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
      >
        {uploading ? 'Saving...' : 'Save Product'}
      </button>
    </div>
  );
};

export default ProductForm;