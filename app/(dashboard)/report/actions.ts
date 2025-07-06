export async function createReport(data: {
  name: string;
  company: string;
  email: string;
  hotel_name: string;
}) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Report created successfully",
  };
}

export async function editReport(data: {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  hotel_name?: string;
}) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Report updated successfully",
  };
}

export async function deleteReport(id: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Report deleted successfully",
  };
}

export async function updateReportStatus(id: string, status: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: `Report status updated to ${status}`,
  };
}
