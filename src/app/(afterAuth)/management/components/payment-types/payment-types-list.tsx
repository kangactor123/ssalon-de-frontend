import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { serverFetch } from "@/shared/utils/server-fetch";

import { PaymentType } from "@/queries/settings/type";

import EmptyTypes from "../empty-types";
import PaymentTypesItem from "./payment-types-item";

export default async function PaymentTypeList() {
  const paymentTypes = await serverFetch<PaymentType[]>("/payment-types");

  return (
    <>
      {paymentTypes.length === 0 ? (
        <EmptyTypes />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>결제 유형</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentTypes.map((paymentType, idx) => (
              <PaymentTypesItem
                key={`${paymentType.id}${idx}`}
                {...paymentType}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
