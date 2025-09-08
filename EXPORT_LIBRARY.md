# Reusable Export Library

This document describes the comprehensive, reusable export library that provides standardized CSV and Excel export functionality across all data tables in the application.

## Overview

The export library consists of four main components:

1. **Export Service** (`/lib/export-service.ts`) - Server-side data processing and file generation
2. **Export Client** (`/lib/export-client.ts`) - Client-side utilities and React hooks
3. **Export Button** (`/components/ui/export-button.tsx`) - Reusable UI component
4. **Export Types** (`/lib/export-types.ts`) - TypeScript type definitions

## Key Features

### 🎯 **Standardized Implementation**

- Consistent export functionality across all tables
- Unified filtering, formatting, and file generation
- Centralized configuration management

### 📊 **Professional File Output**

- **CSV**: Proper escaping, UTF-8 encoding, customizable headers
- **Excel**: Styled headers, column widths, workbook metadata, compression
- **Metadata**: Automatic timestamps, author information, professional styling

### 🔍 **Advanced Filtering**

- Global search across multiple fields
- Multi-select categorical filters
- Date range filtering with flexible formats
- Combinable filter functions

### 🚀 **Developer Experience**

- Full TypeScript support with comprehensive interfaces
- React hooks for seamless integration
- Predefined configurations for common use cases
- Comprehensive error handling with user feedback

## Core Components

### ExportService Class

The main server-side service for data processing and file generation:

```typescript
await ExportService.exportData(
  data, // Your data array
  columns, // Column definitions
  config, // Export configuration
  format, // 'csv' | 'excel'
  filterFn, // Optional filter function
  searchParams // URL search parameters
);
```

### Column Definition

Define how each field should be exported:

```typescript
const columns: ExportColumn<DataType>[] = [
  {
    key: "id",
    header: "ID",
    accessor: (item) => item.id,
    width: 8, // Excel column width
  },
  {
    key: "date",
    header: "Date",
    accessor: (item) => item.createdAt,
    formatter: (value) => formatDate(value), // Custom formatting
    width: 15,
  },
  {
    key: "status",
    header: "Status",
    accessor: (item) => item.isActive,
    formatter: (value) => (value ? "Active" : "Inactive"),
    width: 10,
  },
];
```

### Filter Functions

Create powerful, combinable filter functions:

```typescript
// Global search filter
const globalFilter = ExportService.createGlobalSearchFilter<DataType>([
  "name",
  "email",
  "company",
]);

// Multi-select filter
const statusFilter = ExportService.createMultiSelectFilter<DataType>(
  "status",
  "status"
);

// Date range filter
const dateFilter = ExportService.createDateRangeFilter<DataType>(
  "createdAt",
  "date_created"
);

// Combine multiple filters
const combinedFilter = ExportService.combineFilters(
  globalFilter,
  statusFilter,
  dateFilter
);
```

### React Integration

Use the `useExport` hook for seamless React integration:

```typescript
const { isExporting, handleDownload } = useExport(exportFunction);

return <ExportButton isExporting={isExporting} onDownload={handleDownload} />;
```

## Implementation Guide

### 1. Server Action Setup

Create your export server action:

```typescript
// actions.ts
import { ExportService, ExportConfigs } from "@/lib/export-types";

// Define columns
const exportColumns: ExportColumn<YourDataType>[] = [
  // ... column definitions
];

// Create filter function
const createFilter = (): FilterFunction<YourDataType> => {
  return ExportService.combineFilters(
    ExportService.createGlobalSearchFilter<YourDataType>(["field1", "field2"]),
    ExportService.createMultiSelectFilter<YourDataType>("status", "status")
  );
};

// Export action
export async function exportYourData(
  searchParams: SearchParams,
  format: ExportFormat = "csv"
): Promise<ExportResult> {
  try {
    const data = await fetchYourData(); // Your data fetching logic
    const filterFn = createFilter();

    return await ExportService.exportData(
      data,
      exportColumns,
      ExportConfigs.yourConfig, // Use predefined or custom config
      format,
      filterFn,
      searchParams
    );
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export data",
    };
  }
}
```

### 2. Client Component Integration

Update your table component:

```typescript
// your-table.tsx
import { ExportButton } from "@/components/ui/export-button";
import { useExport } from "@/lib/export-client";
import { exportYourData } from "./actions";

const YourTable = ({ data }) => {
  const { isExporting, handleDownload } = useExport(exportYourData);

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <ExportButton isExporting={isExporting} onDownload={handleDownload} />
        {/* Other toolbar items */}
      </DataTableToolbar>
    </DataTable>
  );
};
```

## Predefined Configurations

The library includes predefined configurations for common use cases:

```typescript
import { ExportConfigs } from "@/lib/export-client";

// Available configurations:
ExportConfigs.bookingLog; // For booking/history data
ExportConfigs.agentList; // For agent management
ExportConfigs.userManagement; // For user tables
ExportConfigs.promoList; // For marketing data
```

## Custom Configuration

Create custom configurations for specific needs:

```typescript
const customConfig: ExportConfig = {
  title: "Custom Report Export",
  subject: "Custom Export",
  sheetName: "Custom Data",
  filenamePrefix: "custom-report",
  includeTimestamp: true,
  author: "Your System",
};
```

## Filter Examples

### Basic Filters

```typescript
// Global search across multiple fields
const searchFilter = ExportService.createGlobalSearchFilter<User>([
  "name",
  "email",
  "company",
]);

// Multi-select status filter
const statusFilter = ExportService.createMultiSelectFilter<User>(
  "status",
  "user_status"
);

// Date range filter
const dateFilter = ExportService.createDateRangeFilter<User>(
  "createdAt",
  "created_date"
);
```

### Advanced Custom Filters

```typescript
// Custom filter with complex logic
const customFilter: FilterFunction<User> = (data, searchParams) => {
  // Custom filtering logic
  if (searchParams.advanced_filter) {
    return data.filter((item) => {
      // Your custom logic here
      return someComplexCondition(item);
    });
  }
  return data;
};

// Combine with other filters
const combinedFilter = ExportService.combineFilters(
  searchFilter,
  statusFilter,
  customFilter
);
```

## Error Handling

The library provides comprehensive error handling:

- **Input validation** with specific error messages
- **Row-level error recovery** for corrupted data
- **Format validation** for export types
- **User-friendly error messages** with toast notifications

## Performance Features

- **Efficient data processing** with proper memory management
- **Compressed Excel files** for faster downloads
- **Debounced export operations** to prevent multiple simultaneous exports
- **Streaming for large datasets** (can be extended)

## Extending the Library

### Adding New Export Formats

```typescript
// In export-service.ts, add new format handling:
if (format === "pdf") {
  return this.generatePDFFile(data, columns, config, filename);
}
```

### Custom Formatters

```typescript
const columns: ExportColumn<Data>[] = [
  {
    key: "currency",
    header: "Amount",
    accessor: (item) => item.amount,
    formatter: (value) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value),
  },
];
```

## Best Practices

1. **Always define column widths** for better Excel formatting
2. **Use formatters** for consistent data presentation
3. **Combine filters efficiently** using the provided utilities
4. **Handle errors gracefully** with user feedback
5. **Test with large datasets** to ensure performance
6. **Use predefined configs** when possible for consistency

## Migration Guide

To migrate existing export functionality:

1. Replace manual CSV/Excel generation with `ExportService.exportData()`
2. Define columns using the `ExportColumn` interface
3. Replace manual filtering with filter functions
4. Update client components to use `useExport` hook and `ExportButton`
5. Remove duplicate code and use predefined configurations

This reusable export library provides a robust, maintainable, and user-friendly solution for data export functionality across your entire application.
