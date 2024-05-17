import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const Email = ({ aps, mesg, recipientList, url }) => {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Parkbot notification service</title>
      </Head>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section>
              <Row>
                <Column align="left">
                  <Img
                    src={`${url}/bot.svg`}
                    width="80"
                    height="80"
                    alt="Parkbot"
                    className="my-0 mx-auto"
                  />
                </Column>
                <Column align="left">
                  <Text className="font-bold text-[64px] text-orange-500 tracking-tighter">Parkbot</Text>
                </Column>
              </Row>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Automatic Parking System <strong>{aps}</strong>
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              {mesg}
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={url}
              >
                See more
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This notification was intended for{" "}
              {recipientList.map((m) => (
                <span className="text-black" key={m}>
                  {m}
                </span>
              ))}
              . If you were not expecting this notification, you can ignore this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Email;
