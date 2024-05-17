require("dotenv").config();
import * as http from "http";
// import * as path from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { serve, send, json } from "micro";
import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  // Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import Email from "./Email"

const i18nextOptions = {
  // initImmediate: false,
  lng: "en",
  fallbackLng: "en",
  backend: { loadPath: "../../github/parkbot-dashboard/messages/{{lng}}.json" },
};

const init = async () => {
  await i18next.use(Backend).init(i18nextOptions);
};

init();

const baseUrl = process.env.SOTEFINSERVICE_URL
  ? `${process.env.SOTEFINSERVICE_URL}`
  : "";

// const Email = ({ aps, mesg, parkbotLink, recipientList }) => {
//   return (
//     <Html lang="en" dir="ltr">
//       <Head>
//         <title>Parkbot notification service</title>
//       </Head>
//       <Tailwind>
//         <Body className="bg-white my-auto mx-auto font-sans px-2">
//           <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
//             <Section className="mt-[16px]">
//               <Img
//                 src={`${baseUrl}/bot.svg`}
//                 width="96"
//                 height="96"
//                 alt="Parkbot"
//                 className="my-0 mx-auto"
//               />
//             </Section>
//             <Text className="text-black text-[14px] leading-[24px]">
//               Automatic Parking System <strong>{aps}</strong>
//             </Text>
//             <Text className="text-black text-[14px] leading-[24px]">
//               {mesg}
//             </Text>
//             <Section className="text-center mt-[32px] mb-[32px]">
//               <Button
//                 className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
//                 href={parkbotLink}
//               >
//                 See more
//               </Button>
//             </Section>
//             <Text className="text-black text-[14px] leading-[24px]">
//               or copy and paste this URL into your browser:{" "}
//               <Link href={parkbotLink} className="text-blue-600 no-underline">
//                 {parkbotLink}
//               </Link>
//             </Text>
//             <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
//             <Text className="text-[#666666] text-[12px] leading-[24px]">
//               This notification was intended for{" "}
//               {recipientList.map((m) => (
//                 <span className="text-black" key={m}>
//                   {m}
//                 </span>
//               ))}
//               . If you were not expecting this notification, you can ignore this
//               email.
//             </Text>
//           </Container>
//         </Body>
//       </Tailwind>
//     </Html>
//   );
// };

const server = new http.Server(
  serve(async (req, res) => {
    const data = await json(req);
    const { aps, alarm, date, device, locale, recipientList } = data;
    const t = await i18next.changeLanguage(locale || "en");
    const a = t(`Alarm.${alarm.key}`);
    const mesg = `AL${alarm.id} ${a}`;
    const emailHtml = render(
      <Email
        aps={aps}
        mesg={mesg}
        // parkbotLink={baseUrl}
        recipientList={recipientList}
        url={baseUrl}
      />
    );
    const options = {
      from: process.env.SENDER,
      to: recipientList,
      subject: "Parkbot Notifier",
      html: emailHtml,
    };
    try {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      sendgrid.send(options);
      send(res, 200, data);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  })
);

server.listen(3000);
