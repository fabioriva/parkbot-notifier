require("dotenv").config();
import * as http from "http";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { serve, send, json } from "micro";
import React from "react";
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
      send(res, 200, options);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  })
);

server.listen(3000);
