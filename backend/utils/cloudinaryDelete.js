import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) return;

  let result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result === "not_found") {
    result = await cloudinary.uploader.destroy(publicId + ".pdf", {
      resource_type: "raw",
    });
  }

  if (result.result === "not_found") {
    result = await cloudinary.uploader.destroy(publicId + ".docx", {
      resource_type: "raw",
    });
  }

  return result;
};
