# Email Template Editor Component

## Overview

This project now includes a custom WYSIWYG editor component built with Tiptap for editing HTML email templates. The editor is designed to work seamlessly with the existing shadcn UI components and preserves placeholder variables during editing.

## Features

- Basic text formatting (bold, italic)
- List creation (bulleted and numbered)
- Placeholder preservation for dynamic content variables
- Clean, modern UI that integrates with shadcn components
- Responsive design

## Installation

The required dependencies have already been added to the project:

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

## Usage

### Basic Usage

```jsx
import Editor from "@/components/ui/editor";

<Editor
  content={htmlContent}
  onChange={setHtmlContent}
  placeholder="Enter your email template..."
/>;
```

### In a Form

```jsx
import { useForm } from "react-hook-form";
import Editor from "@/components/ui/editor";

function EmailForm() {
  const form = useForm({
    defaultValues: {
      body: "<p>Hello .GuestName,</p>",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Editor
        content={form.watch("body")}
        onChange={(content) => form.setValue("body", content)}
      />
    </form>
  );
}
```

## Placeholders

The editor is designed to work with placeholder variables in the format `.VariableName`. These placeholders will be preserved during editing and can be easily identified in the editor.

Example placeholders:

- `.GuestName`
- `.BookingPeriod`
- `.RoomType`
- `.CheckInDate`
- `.CheckOutDate`

## Customization

The editor component accepts the following props:

| Prop          | Type     | Description                            |
| ------------- | -------- | -------------------------------------- |
| `content`     | string   | The initial HTML content               |
| `onChange`    | function | Callback function when content changes |
| `placeholder` | string   | Placeholder text when editor is empty  |
| `className`   | string   | Additional CSS classes for styling     |

## Styling

The editor uses Tailwind CSS classes for styling and can be customized through the `className` prop. The toolbar and content area have distinct styling that can be overridden with custom CSS.

## Integration with Email Settings Form

The editor has been integrated into the email settings form at `components/dashboard/settings/email-setting/form/email-setting-form.tsx`, replacing the textarea for the email body template.

## Demo

A demo page is available at `/dummy/editor-demo` to showcase the editor's functionality with sample email templates containing placeholders.
