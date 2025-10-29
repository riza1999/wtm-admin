"use client";

import { PromoGroupMembers } from "@/app/(dashboard)/promo-group/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Option } from "@/types/data-table";
import { X } from "lucide-react";
import AddAgentCompanyDialog from "./dialog/add-agent-company-dialog";
import AddMemberPromoGroupDialog from "./dialog/add-member-promo-group-dialog";
import DeletePromoGroupMemberDialog from "./dialog/delete-promo-group-member-dialog ";
import { useState } from "react";

interface MembersCardProps {
  members: PromoGroupMembers[];
  companyOptions: Option[];
  promoGroupId: string;
}

export function MembersCard({
  members,
  companyOptions,
  promoGroupId,
}: MembersCardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [member, setMember] = useState<PromoGroupMembers | null>(null);

  const onRemoveMember = (member: PromoGroupMembers) => {
    setMember(member);
    setOpenDialog(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <AddMemberPromoGroupDialog
            companyOptions={companyOptions}
            promoGroupId={promoGroupId}
          />
          <AddAgentCompanyDialog
            companyOptions={companyOptions}
            promoGroupId={promoGroupId}
          />
        </div>

        {/* Members List */}
        <div className="space-y-2">
          {members.length === 0 && (
            <div className="text-sm text-muted-foreground py-4 text-center">
              No members found.
            </div>
          )}
          {members.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
            >
              <span className="text-sm">
                {index + 1}.{" "}
                <span className="font-semibold">{member.name}</span> |{" "}
                {member.agent_company}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => onRemoveMember(member)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <DeletePromoGroupMemberDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          member={member}
          promoGroupId={promoGroupId}
        />
      </CardContent>
    </Card>
  );
}
