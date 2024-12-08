import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatPrice } from "@/helpers/formatPrice";
import { format } from "date-fns"; // For formatting dates
import { formatPaymentMethod } from "@/helpers/formatPaymentMethod";
import { formatDate } from "@/helpers/formatDate";
import Link from "next/link";
import { capitalizeFirstLetter } from "@/helpers/capitalizeFirstLetter";
import { IoIosCheckmarkCircle, IoIosCloseCircle } from "react-icons/io";

interface Payment {
  _id: string;
  invoiceNumber: string;
  paidAt: number; // Unix timestamp (in seconds)
  amount: number; // Amount in cents
  status: string; // "paid", "pending", etc.
  paymentMethod: string; // "gcash", "grab_pay", etc.
  plan: {
    _id: string;
    title: string;
  };
}

interface OrderHistoryTableProps {
  payments: Payment[]; // The component expects an array of Payment objects
}

const OrderHistoryTable = ({ payments }: OrderHistoryTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] whitespace-nowrap">Invoice</TableHead>
          <TableHead className="whitespace-nowrap">
            Date & Time Issued
          </TableHead>
          <TableHead className="whitespace-nowrap">Description</TableHead>
          <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
          <TableHead className="whitespace-nowrap">Status</TableHead>
          <TableHead className="whitespace-nowrap">Payment Method</TableHead>
          <TableHead className="whitespace-nowrap">Receipt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment._id}>
            <TableCell className="font-medium whitespace-nowrap">
              {payment.invoiceNumber}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatDate(payment.paidAt)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {payment.plan?.title}
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              {formatPrice(payment.amount)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {payment.status === "paid" ? (
                <div className=" text-green-400">
                  {capitalizeFirstLetter(payment.status)}
                </div>
              ) : payment.status === "failed" ? (
                <div className=" text-red-400">
                  {capitalizeFirstLetter(payment.status)}
                </div>
              ) : payment.status === "refunded" ? (
                <div className=" text-blue-400">
                  {capitalizeFirstLetter(payment.status)}
                </div>
              ) : null}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatPaymentMethod(payment.paymentMethod)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <Link
                href={`/subscription/success/${payment.invoiceNumber}`}
                className="text-blue-500 hover:underline"
              >
                View Receipt
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderHistoryTable;
