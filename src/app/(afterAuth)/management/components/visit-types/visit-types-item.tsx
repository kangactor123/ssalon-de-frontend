"use client";

import { memo, PropsWithChildren, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Save, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { TableCell, TableRow } from "@/shared/ui/table";
import { VisitType } from "@/queries/settings/type";
import { useDeleteVisitType, useUpdateVisitType } from "@/queries/settings";
import { ConfirmDialog } from "@/shared/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "@/shared/constants/query-keys";

type Props = PropsWithChildren<{
  id: string;
  name: string;
}>;

const VisitTypesItem: React.FC<Props> = ({ id, name }) => {
  const client = useQueryClient();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState<string>("");
  const [editingName, setEditingName] = useState("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const { mutate: deleteVisitType } = useDeleteVisitType({
    onSuccess: () => {
      afterMutateVisitType();
    },
  });

  const { mutate: updateVisitType } = useUpdateVisitType({
    onSuccess: () => {
      setIsEdit(false);
      setEditingId("");
      setEditingName("");
      afterMutateVisitType();
    },
  });

  const afterMutateVisitType = useCallback(() => {
    router.refresh();
    client.invalidateQueries({
      queryKey: [KEYS.settings.visitTypes],
    });
  }, [router, client]);

  const handleClickEdit = useCallback((visitType: VisitType) => {
    setIsEdit(true);
    setEditingId(visitType.id);
    setEditingName(visitType.name);
  }, []);

  const handleClickSave = useCallback(() => {
    updateVisitType({
      id: editingId,
      name: editingName,
    });
  }, [editingId, editingName, updateVisitType]);

  const handleClickDelete = useCallback(
    (id: string) => {
      deleteVisitType(id);
    },
    [deleteVisitType]
  );

  return (
    <>
      <TableRow key={id}>
        <TableCell>
          {editingId === id ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
            />
          ) : (
            name
          )}
        </TableCell>
        <TableCell className="flex justify-end gap-1 text-right">
          {isEdit && editingId === id ? (
            <Button size="sm" onClick={handleClickSave} variant="outline">
              <Save className="w-4 h-4" />
            </Button>
          ) : (
            <>
              <Button
                onClick={() => handleClickEdit({ id, name })}
                size="sm"
                variant="outline"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setOpenDeleteConfirm(true)}
                size="sm"
                variant="outline"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={openDeleteConfirm}
        setOpen={setOpenDeleteConfirm}
        onConfirm={() => handleClickDelete(id)}
        title="방문 유형 삭제"
        description="방문 유형을 삭제하시겠습니까? 삭제 시 관련 데이터를 확인할 수 없습니다."
        confirmText="삭제"
      />
    </>
  );
};

export default memo(VisitTypesItem);
