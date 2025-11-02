import { EmailTemplate } from "@/app/(dashboard)/settings/email-setting/types";
import { Card, CardContent } from "@/components/ui/card";

interface EmailPreviewProps {
  emailTemplate: EmailTemplate;
}

const EmailPreview = ({ emailTemplate }: EmailPreviewProps) => {
  return (
    <Card className="w-full h-full min-h-[320px]">
      <CardContent className="text-muted-foreground text-base leading-relaxed p-6">
        <div
          className="email-body"
          dangerouslySetInnerHTML={{ __html: emailTemplate.body }}
        />
        <br />
        <br />
        <div
          className="email-signature"
          dangerouslySetInnerHTML={{ __html: emailTemplate.signature }}
        />
      </CardContent>
    </Card>
  );
};

export default EmailPreview;
