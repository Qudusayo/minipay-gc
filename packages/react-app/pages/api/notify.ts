// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  error: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      try {
        const amount = req.query.amount;
        const recipient = (req.query.recipient as string).replace("+", "");

        let bodyContent = new FormData();
        bodyContent.append("user", process.env.NEXT_PUBLIC_HOLLATAG_USERNAME!);
        bodyContent.append("pass", process.env.NEXT_PUBLIC_HOLLATAG_PASSWORD!);
        bodyContent.append("from", "MiniPayGC");
        bodyContent.append("to", recipient);
        bodyContent.append(
          "msg",
          `Hello!!, Someone sent you a gift card worth $${amount}!. Redeem at ${process.env.NEXT_PUBLIC_API_URL}. Enjoy! MGC`
        );
        bodyContent.append("type", "0");

        let response = await fetch("https://sms.hollatags.com/api/send", {
          method: "POST",
          body: bodyContent,
        });

        let data = await response.text();

        return res.status(200).json({
          error: false,
          message: data,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          error: true,
          message: "Something went wrong",
        });
      }
    default:
      return res.status(400).json({
        error: true,
        message: "Method not supported",
      });
  }
}
