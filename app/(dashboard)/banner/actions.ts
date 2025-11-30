"use server";

import { apiCall } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createBanner(formData: FormData) {
  try {
    const response = await apiCall("banners", {
      method: "POST",
      body: formData,
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to create banner",
      };
    }

    revalidatePath("/banner", "layout");

    return {
      success: true,
      message: response.message || "Banner created",
    };
  } catch (error) {
    console.error("Error creating banner:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create banner",
    };
  }
}

export async function updateBanner(id: string, formData: FormData) {
  console.log({ id, formData });

  try {
    const response = await apiCall(`banners/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update banner",
      };
    }

    revalidatePath("/banner", "layout");

    return {
      success: true,
      message: response.message || "Banner updated",
    };
  } catch (error) {
    console.error("Error updating banner:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update banner",
    };
  }
}

export async function deleteBanner(id: string) {
  try {
    const response = await apiCall(`banners/${id}`, {
      method: "DELETE",
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to delete banner",
      };
    }

    revalidatePath("/banner", "layout");

    return {
      success: true,
      message: response.message || "Banner deleted",
    };
  } catch (error) {
    console.error("Error deleting banner:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete banner",
    };
  }
}

export async function changeBannerStatus(body: {
  id: string;
  status: boolean;
}) {
  try {
    const response = await apiCall(`banners/status`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to change banner status",
      };
    }

    revalidatePath("/banner", "layout");

    return {
      success: true,
      message: response.message || "Banner status changed",
    };
  } catch (error) {
    console.error("Error changing banner status:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to change banner status",
    };
  }
}

export async function changeBannerOrder(body: { id: string; order: number }) {
  try {
    const response = await apiCall(`banners/order`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to change banner order",
      };
    }

    revalidatePath("/banner", "layout");

    return {
      success: true,
      message: response.message || "Banner order changed",
    };
  } catch (error) {
    console.error("Error changing banner order:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to change banner order",
    };
  }
}
