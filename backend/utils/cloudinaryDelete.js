import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) return;

  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
