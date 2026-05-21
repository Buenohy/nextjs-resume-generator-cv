import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTranslations } from "next-intl";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
];

export default function ComponentsPage() {
  const t = useTranslations("ComponentsPage");

  return (
    <div className="flex flex-col gap-10 p-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      <h2>Card</h2>
      <Card>
        <CardHeader>
          <CardTitle>{t("card.title")}</CardTitle>
          <CardDescription>{t("card.description")}</CardDescription>
          <CardAction>{t("card.action")}</CardAction>
        </CardHeader>
        <CardContent>
          <p>{t("card.content")}</p>
        </CardContent>
        <CardFooter>
          <p>{t("card.footer")}</p>
        </CardFooter>
      </Card>

      <h2>{t("button")}</h2>
      <Button>{t("button")}</Button>

      <h2>Text Area</h2>
      <Textarea />

      <h2>Table</h2>
      <Table>
        <TableCaption>{t("table.caption")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">{t("table.headers.invoice")}</TableHead>
            <TableHead>{t("table.headers.status")}</TableHead>
            <TableHead>{t("table.headers.method")}</TableHead>
            <TableHead className="text-right">
              {t("table.headers.amount")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>

              <TableCell>{t(`status.${invoice.paymentStatus}`)}</TableCell>
              <TableCell>{t(`methods.${invoice.paymentMethod}`)}</TableCell>

              <TableCell className="text-right">
                {invoice.totalAmount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>{t("table.total")}</TableCell>
            <TableCell className="text-right">$1,200.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
