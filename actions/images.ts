"use server";

import prisma from "@/lib/prisma";
import { imageSchema, imageUpdateSchema, type ImageSchema, type ImageUpdateSchema } from "@/lib/validation/image";
import { getUser } from "@/lib/auth/auth-session";
import { revalidatePath } from "next/cache";

export async function getImages() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw new Error("Failed to fetch images");
  }
}

export async function getImageById(id: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return null;
    }

    return image;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Failed to fetch image");
  }
}

export async function createImage(data: ImageSchema) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = imageSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  const {
    url,
    altText,
    shortDescription,
    productId,
    categoryId
  } = result.data;

  try {
    const image = await prisma.image.create({
      data: {
        url,
        altText,
        shortDescription,
        productId: productId || null,
        categoryId: categoryId || null,
      },
    });

    revalidatePath("/admin/images");
    return image;
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error("Failed to save image");
  }
}

export async function updateImage(id: string, data: ImageUpdateSchema) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = imageUpdateSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  const { altText, shortDescription } = result.data;

  try {
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        altText,
        shortDescription,
      },
    });

    revalidatePath("/admin/images");
    revalidatePath(`/admin/images/${id}`);
    return updatedImage;
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("Failed to update image");
  }
}

export async function deleteImage(id: string) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    // Note: We might want to also delete from Cloudinary here if fileKey is available
    await prisma.image.delete({
      where: { id },
    });

    revalidatePath("/admin/images");
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}
