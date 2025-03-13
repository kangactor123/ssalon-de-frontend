import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import EmptyTypes from "../empty-types";
import { serverFetch } from "@/shared/utils/server-fetch";
import VisitTypesItem from "./visit-types-item";
import { VisitType } from "@/queries/settings/type";

export default async function VisitTypesList() {
  const visitTypes = await serverFetch<VisitType[]>("/settings/visit-types");

  return (
    <>
      {visitTypes.length === 0 ? (
        <EmptyTypes type="방문 유형" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>방문 유형</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitTypes.map((visitType, idx) => (
              <VisitTypesItem key={`${visitType.id}${idx}`} {...visitType} />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
