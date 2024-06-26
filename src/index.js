require("dotenv").config();
import fs from "fs/promises";
import * as http from "http";
import { createTranslator } from "next-intl";
import { serve, send, json } from "micro";
import React from "react";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import Email from "./Email";

const getTranslation = async (alarm, locale) => {
  try {
    const data = await fs.readFile(
      `../../github/parkbot-dashboard/messages/${locale}.json`,
      "utf8"
    );
    const json = JSON.parse(data);
    const messages = json.Alarm;
    const t = createTranslator({ locale, messages });
    const a = t(alarm.key, alarm.query);
    return a;
  } catch (error) {
    console.error("Error occurred while reading file:", error);
  }
};

const baseUrl = process.env.SOTEFINSERVICE_URL
  ? `${process.env.SOTEFINSERVICE_URL}`
  : "";

const server = new http.Server(
  serve(async (req, res) => {
    const data = await json(req);
    const { aps, alarm, date, device, locale, recipientList } = data;
    const info = await getTranslation(alarm, locale);
    const mesg = `${date} ${device.key} AL${alarm.id} ${info}`;
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

server.listen(process.env.HTTP_PORT);
